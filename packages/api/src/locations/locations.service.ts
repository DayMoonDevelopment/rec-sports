import { Injectable } from '@nestjs/common';
import { Expression, sql } from 'kysely';

import { Sport } from '../common/enums/sport.enum';
import { CursorUtil } from '../common/pagination/cursor.util';
import { PageInfo } from '../common/pagination/page-info.model';
import { DatabaseService } from '../database/database.service';
import { LocationsArgs } from './dto/locations.args';
import { LocationEdge } from './models/location-edge.model';
import { Location } from './models/location.model';
import { LocationsConnection } from './models/locations-connection.model';

import type { SqlBool } from 'kysely';

@Injectable()
export class LocationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findLocationById(id: string): Promise<Location | null> {
    const { client } = this.databaseService;

    const result = await client
      .selectFrom('locations')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    // Transform database result to GraphQL type
    return {
      id: result.id,
      name: result.name || 'Unknown Location', // Handle nullable name
      address: this.buildAddress(result),
      geo: {
        latitude: result.lat,
        longitude: result.lon,
      },
      sports: (result.sport_tags || []).map(
        (tag) => tag.toUpperCase() as Sport,
      ),
      bounds: (
        result.bounds as { geometry: { lat: number; lon: number }[] }
      ).geometry.map((g) => ({ latitude: g.lat, longitude: g.lon })),
    };
  }

  async findLocations(args: LocationsArgs): Promise<LocationsConnection> {
    // Smart query optimization based on search parameters
    const searchOptimization = this.analyzeSearchComplexity(args);

    // Apply intelligent optimizations instead of hard rejections
    this.applySearchOptimizations(args, searchOptimization);

    const { client } = this.databaseService;

    // Apply intelligent result limiting based on search complexity
    const limit = this.calculateOptimalLimit(args, searchOptimization);
    const hasTextSearch = Boolean(args.query?.trim());

    // Use more efficient base query - only select needed fields initially
    let query = client.selectFrom('locations').select([
      'id',
      'name',
      'lat',
      'lon',
      'created_at',
      'street',
      'city',
      'state',
      'postal_code',
      'sport_tags',
      'bounds', // Still need bounds but we'll optimize the transformation
    ]);

    // Simplified search ranking for better performance on large datasets
    if (hasTextSearch) {
      const searchRank = this.buildSimpleSearchRankExpression(args.query!);
      query = query.select([sql<number>`(${searchRank})`.as('search_rank')]);
    }

    // Apply filters using composable approach
    const filterExpressions = this.buildFilterExpressions(args);

    if (filterExpressions.length > 0) {
      query = query.where((eb) => eb.and(filterExpressions));
    }

    // Handle cursor-based pagination
    if (args.after) {
      const { id, timestamp } = CursorUtil.parseCursor(args.after);
      if (timestamp) {
        // Use timestamp for ordering
        query = query.where(
          'created_at',
          '<',
          new Date(timestamp).toISOString(),
        );
      } else if (hasTextSearch) {
        // For search queries, use ID-based cursor as fallback
        query = query.where('id', '>', id);
      } else {
        // For non-search queries, use name-based cursor
        query = query.where('name', '>', id);
      }
    }

    // Add ordering - search results by relevance, others by created_at (for consistent cursor pagination)
    if (hasTextSearch) {
      query = query
        .orderBy(sql`search_rank`, 'desc')
        .orderBy('created_at', 'desc')
        .orderBy('id', 'asc'); // Tie-breaker for consistent ordering
    } else {
      query = query.orderBy('created_at', 'desc').orderBy('id', 'asc');
    }

    // Get one extra result to check if there are more pages
    query = query.limit(limit + 1);

    // Execute only the main query - skip expensive count query for better performance
    // Add query timeout to prevent hanging queries
    const queryPromise = query.execute();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () =>
          reject(new Error('Query timeout: Request took too long to execute')),
        30000,
      ); // 30 second timeout
    });

    const results = (await Promise.race([
      queryPromise,
      timeoutPromise,
    ])) as any[];

    // For large datasets, we skip total count to improve performance
    // Clients should use cursor-based pagination instead
    const totalCount = -1; // Indicate unknown count
    const hasNextPage = results.length > limit;
    const nodes = results.slice(0, limit);

    // Optimized data transformation for better performance
    const edges: LocationEdge[] = nodes.map((row) => {
      // Pre-calculate expensive operations
      const sports = (row.sport_tags || []).map(
        (tag) => tag.toUpperCase() as Sport,
      );
      const bounds = this.transformBoundsOptimized(row.bounds);
      const address = this.buildAddress(row);

      const location: Location = {
        id: row.id,
        name: row.name || 'Unknown Location',
        address,
        geo: {
          latitude: row.lat,
          longitude: row.lon,
        },
        sports,
        bounds,
      };

      return {
        node: location,
        cursor: CursorUtil.createCursor(
          row.id,
          row.created_at ? new Date(row.created_at) : undefined,
        ),
      };
    });

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  private buildFilterExpressions(args: LocationsArgs): Expression<SqlBool>[] {
    const expressions: Expression<SqlBool>[] = [];

    if (args.requiredSports?.length) {
      expressions.push(this.createSportsFilter(args.requiredSports));
    }

    if (args.query) {
      expressions.push(
        this.createTextSearchFilter(args.query, 'combined', 0.3),
      );
    }

    // Handle region filter
    if (args.region?.boundingBox) {
      expressions.push(this.createBoundingBoxFilter(args.region.boundingBox));
    }

    if (args.region?.centerPoint) {
      expressions.push(this.createRadiusFilter(args.region.centerPoint));
    }

    return expressions;
  }

  private createSportsFilter(sports: Sport[]): Expression<SqlBool> {
    const sportTags = sports.map((sport) => sport.toLowerCase());
    return sql<boolean>`sport_tags && ${sportTags}`;
  }

  private createTextSearchFilter(
    query: string,
    searchMode: string = 'combined',
    similarityThreshold: number = 0.3,
  ): Expression<SqlBool> {
    const cleanQuery = this.prepareSearchQuery(query);

    switch (searchMode) {
      case 'exact':
        return this.createExactSearchFilter(query);

      case 'fuzzy':
        return this.createFuzzySearchFilter(query, similarityThreshold);

      case 'phrase':
        return this.createPhraseSearchFilter(cleanQuery);

      case 'combined':
      default:
        return this.createCombinedSearchFilter(
          query,
          cleanQuery,
          similarityThreshold,
        );
    }
  }

  private createExactSearchFilter(query: string): Expression<SqlBool> {
    return sql<boolean>`(
      name ILIKE ${query}
      OR city ILIKE ${query}
      OR state ILIKE ${query}
      OR street ILIKE ${query}
      OR ${query} = ANY(sport_tags)
    )`;
  }

  private createFuzzySearchFilter(
    query: string,
    threshold: number,
  ): Expression<SqlBool> {
    return sql<boolean>`(
      similarity(name, ${query}) > ${threshold}
      OR similarity(city, ${query}) > ${threshold}
      OR similarity(street, ${query}) > ${threshold}
    )`;
  }

  private createPhraseSearchFilter(cleanQuery: string): Expression<SqlBool> {
    return sql<boolean>`search_vector @@ phraseto_tsquery('english', ${cleanQuery})`;
  }

  private createCombinedSearchFilter(
    query: string,
    cleanQuery: string,
    threshold: number,
  ): Expression<SqlBool> {
    return sql<boolean>`(
      -- Full-text search using search_vector (weighted by search configuration)
      search_vector @@ plainto_tsquery('english', ${cleanQuery})
      OR
      -- Trigram fuzzy matching for typo tolerance
      similarity(name, ${query}) > ${threshold}
      OR similarity(city, ${query}) > ${threshold}
      OR similarity(street, ${query}) > ${threshold}
      OR
      -- Exact prefix matching for immediate results
      (name ILIKE ${query + '%'} OR city ILIKE ${query + '%'} OR street ILIKE ${query + '%'})
      OR
      -- Sport tag exact matching (case-insensitive)
      ${query.toLowerCase()} = ANY(sport_tags)
      OR
      -- Partial sport tag matching
      EXISTS (
        SELECT 1 FROM unnest(sport_tags) AS tag
        WHERE tag ILIKE ${'%' + query.toLowerCase() + '%'}
      )
    )`;
  }

  private prepareSearchQuery(query: string): string {
    // Clean the query: remove extra spaces, handle special characters
    return query
      .trim()
      .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .toLowerCase();
  }

  // Simplified, high-performance search ranking for large datasets
  private buildSimpleSearchRankExpression(query: string): string {
    const cleanQuery = this.prepareSearchQuery(query);

    // Use only the most essential ranking factors to avoid expensive calculations
    return `
      CASE
        -- Exact name match gets highest priority
        WHEN LOWER(name) = '${cleanQuery}' THEN 100
        -- Name prefix match (very fast with index)
        WHEN LOWER(name) LIKE '${cleanQuery}%' THEN 80
        -- City exact match
        WHEN LOWER(city) = '${cleanQuery}' THEN 70
        -- City prefix match
        WHEN LOWER(city) LIKE '${cleanQuery}%' THEN 60
        -- Sport tag exact match
        WHEN '${cleanQuery}' = ANY(sport_tags) THEN 90
        -- Full-text search using built-in index (most efficient for text search)
        WHEN search_vector @@ plainto_tsquery('english', '${cleanQuery}') THEN
          ts_rank_cd(search_vector, plainto_tsquery('english', '${cleanQuery}')) * 50
        ELSE 0
      END
    `;
  }

  // Keep original complex function for reference but mark as deprecated
  private buildSearchRankExpression(
    query: string,
    searchMode: string,
    threshold: number,
  ): string {
    const cleanQuery = this.prepareSearchQuery(query);

    switch (searchMode) {
      case 'exact':
        return `
          CASE
            WHEN name ILIKE '${query}' THEN 1.0
            WHEN city ILIKE '${query}' THEN 0.8
            WHEN street ILIKE '${query}' THEN 0.6
            WHEN '${query}' = ANY(sport_tags) THEN 0.9
            ELSE 0
          END
        `;

      case 'fuzzy':
        return `
          GREATEST(
            COALESCE(similarity(name, '${query}'), 0) * 1.0,
            COALESCE(similarity(city, '${query}'), 0) * 0.8,
            COALESCE(similarity(street, '${query}'), 0) * 0.6
          )
        `;

      case 'phrase':
        return `
          CASE
            WHEN search_vector @@ phraseto_tsquery('english', '${cleanQuery}') THEN
              ts_rank_cd(search_vector, phraseto_tsquery('english', '${cleanQuery}')) * 1.2
            ELSE 0
          END
        `;

      case 'combined':
      default:
        return `
          -- Full-text search ranking
          CASE
            WHEN search_vector @@ plainto_tsquery('english', '${cleanQuery}') THEN
              ts_rank_cd(search_vector, plainto_tsquery('english', '${cleanQuery}')) * 1.0
            ELSE 0
          END +
          -- Fuzzy similarity ranking
          GREATEST(
            COALESCE(similarity(name, '${query}'), 0) * 0.8,
            COALESCE(similarity(city, '${query}'), 0) * 0.6,
            COALESCE(similarity(street, '${query}'), 0) * 0.4
          ) +
          -- Exact prefix matching boost
          CASE
            WHEN name ILIKE '${query}%' THEN 0.9
            WHEN city ILIKE '${query}%' THEN 0.7
            WHEN street ILIKE '${query}%' THEN 0.5
            ELSE 0
          END +
          -- Sport tag matching boost
          CASE
            WHEN '${query.toLowerCase()}' = ANY(sport_tags) THEN 0.95
            WHEN EXISTS (
              SELECT 1 FROM unnest(sport_tags) AS tag
              WHERE tag ILIKE '%${query.toLowerCase()}%'
            ) THEN 0.6
            ELSE 0
          END
        `;
    }
  }

  // Performance optimization: Check if query would benefit from index usage
  private shouldUseFullTextSearch(query: string, searchMode: string): boolean {
    // Full-text search is most efficient for:
    // - Longer queries (3+ words)
    // - Common words that benefit from stemming
    // - Combined search mode
    const wordCount = query.trim().split(/\s+/).length;
    const queryLength = query.trim().length;

    return (
      (searchMode === 'combined' && wordCount >= 2) ||
      (searchMode === 'phrase' && wordCount >= 2) ||
      queryLength >= 10
    );
  }

  // Performance monitoring: Log slow queries for optimization
  private logSearchPerformance(
    query: string,
    searchMode: string,
    resultCount: number,
    executionTime: number,
  ): void {
    // Log slow searches for analysis (>100ms)
    if (executionTime > 100) {
      console.warn('Slow search query detected', {
        query: query.substring(0, 100), // Limit logged query length
        searchMode,
        resultCount,
        executionTime,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Enhanced search with performance tracking
  async findLocationsWithMetrics(
    args: LocationsArgs,
  ): Promise<LocationsConnection & { searchMetrics?: any }> {
    const startTime = Date.now();
    const result = await this.findLocations(args);
    const executionTime = Date.now() - startTime;

    // Log performance for monitoring
    if (args.query) {
      this.logSearchPerformance(
        args.query,
        'combined',
        result.totalCount,
        executionTime,
      );
    }

    // In development, include metrics in response
    if (process.env.NODE_ENV === 'development') {
      return {
        ...result,
        searchMetrics: {
          executionTime,
          query: args.query,
          searchMode: 'combined',
          totalResults: result.totalCount,
          hasTextSearch: Boolean(args.query),
        },
      };
    }

    return result;
  }

  private createBoundingBoxFilter(boundingBox: {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  }): Expression<SqlBool> {
    const { northEast, southWest } = boundingBox;

    // Smart optimization based on bounding box size
    const latDiff = Math.abs(northEast.latitude - southWest.latitude);
    const lngDiff = Math.abs(northEast.longitude - southWest.longitude);

    // Progressive optimization strategy:
    // - Small areas (< 5°): Use precise PostGIS for accuracy
    // - Medium areas (5°-20°): Use simple bounds for speed
    // - Large areas (20°+): Use simple bounds + early termination hints

    if (latDiff <= 5 && lngDiff <= 5) {
      // Small area: Use precise PostGIS for best accuracy
      return sql<boolean>`gis.ST_Within(
        geo::gis.geometry,
        gis.ST_MakeEnvelope(${sql.literal(southWest.longitude)}, ${sql.literal(southWest.latitude)}, ${sql.literal(northEast.longitude)}, ${sql.literal(northEast.latitude)}, 4326)
      )`;
    } else {
      // Medium to large areas: Use fast index-friendly bounds
      // This works well for multi-state or country-wide searches
      return sql<boolean>`(
        lat BETWEEN ${sql.literal(southWest.latitude)} AND ${sql.literal(northEast.latitude)} AND
        lon BETWEEN ${sql.literal(southWest.longitude)} AND ${sql.literal(northEast.longitude)}
      )`;
    }
  }

  private createRadiusFilter(centerPoint: {
    point: { latitude: number; longitude: number };
    radiusMiles: number;
  }): Expression<SqlBool> {
    const { point, radiusMiles } = centerPoint;

    // Progressive optimization for radius searches
    // - Small radius (≤100 miles): Use precise PostGIS distance
    // - Medium radius (100-500 miles): Use bounding box approximation
    // - Large radius (500+ miles): Use bounding box (good for multi-state searches)

    if (radiusMiles <= 100) {
      // Small radius: Use precise PostGIS distance functions for accuracy
      const radiusMeters = radiusMiles * 1609.344;
      return sql<boolean>`gis.ST_DWithin(
        geo::gis.geography,
        gis.ST_SetSRID(gis.ST_MakePoint(${sql.literal(point.longitude)}, ${sql.literal(point.latitude)}), 4326)::gis.geography,
        ${sql.literal(radiusMeters)}
      )`;
    } else {
      // Medium to large radius: Use fast bounding box approximation
      // Rough approximation: 1 degree ≈ 69 miles
      // Add small buffer to account for approximation errors
      const degreeBuffer = (radiusMiles * 1.1) / 69;
      return sql<boolean>`(
        lat BETWEEN ${sql.literal(point.latitude - degreeBuffer)} AND ${sql.literal(point.latitude + degreeBuffer)} AND
        lon BETWEEN ${sql.literal(point.longitude - degreeBuffer)} AND ${sql.literal(point.longitude + degreeBuffer)}
      )`;
    }
  }

  // Optimized bounds transformation with better error handling
  private transformBoundsOptimized(
    boundsData: any,
  ): { latitude: number; longitude: number }[] {
    try {
      if (!boundsData?.geometry || !Array.isArray(boundsData.geometry)) {
        return [];
      }

      return boundsData.geometry.map((g: any) => ({
        latitude: g.lat,
        longitude: g.lon,
      }));
    } catch (error) {
      return [];
    }
  }

  private buildAddress(row: any) {
    // Check if all required address fields are present
    const requiredFields = ['street', 'city', 'state', 'postal_code'];
    const hasAllRequiredFields = requiredFields.every(
      (field) => row[field] && row[field].trim() !== '',
    );

    if (!hasAllRequiredFields) {
      return null;
    }

    return {
      street: row.street,
      street2: null, // Database doesn't have street2 field yet
      city: row.city,
      stateCode: row.state, // Database state column contains the 2-letter code
      postalCode: row.postal_code,
      // id and state (full name) will be resolved by AddressResolver
    } as any; // Cast to any since we're omitting id and state which will be resolved
  }

  // Smart search complexity analysis
  private analyzeSearchComplexity(args: LocationsArgs): {
    complexity: 'low' | 'medium' | 'high' | 'extreme';
    areaSize: number;
    hasFilters: boolean;
    hasTextSearch: boolean;
    estimatedResults: number;
  } {
    let areaSize = 0;
    let complexity: 'low' | 'medium' | 'high' | 'extreme' = 'low';

    // Calculate area size
    if (args.region?.centerPoint) {
      areaSize = Math.PI * Math.pow(args.region.centerPoint.radiusMiles, 2);
    } else if (args.region?.boundingBox) {
      const { northEast, southWest } = args.region.boundingBox;
      const latDiff = Math.abs(northEast.latitude - southWest.latitude);
      const lngDiff = Math.abs(northEast.longitude - southWest.longitude);
      // Approximate area in square miles (rough conversion: 1 degree ≈ 69 miles)
      areaSize = latDiff * lngDiff * 69 * 69;
    } else {
      // No region filter = entire dataset
      areaSize = Infinity;
    }

    const hasFilters = !!(args.requiredSports?.length || args.query?.trim());
    const hasTextSearch = Boolean(args.query?.trim());

    // Complexity classification based on multiple factors
    if (areaSize === Infinity && !hasFilters) {
      complexity = 'extreme'; // Entire dataset, no filters
    } else if (areaSize > 500000 && !hasFilters) {
      complexity = 'high'; // Very large area with no filters
    } else if (areaSize > 100000) {
      complexity = hasFilters ? 'medium' : 'high';
    } else if (areaSize > 10000) {
      complexity = hasFilters ? 'low' : 'medium';
    } else {
      complexity = 'low'; // Small area searches are always fast
    }

    // Estimate potential results based on area size and filters
    let estimatedResults = Math.min(Math.floor(areaSize / 100), 10000); // Rough estimate
    if (hasFilters) estimatedResults = Math.floor(estimatedResults / 3);
    if (hasTextSearch) estimatedResults = Math.floor(estimatedResults / 2);

    return {
      complexity,
      areaSize,
      hasFilters,
      hasTextSearch,
      estimatedResults: Math.max(estimatedResults, 20), // Minimum estimate
    };
  }

  // Apply optimizations based on search complexity
  private applySearchOptimizations(
    args: LocationsArgs,
    optimization: ReturnType<typeof this.analyzeSearchComplexity>,
  ): void {
    // Only reject truly unreasonable requests
    if (optimization.complexity === 'extreme' && !optimization.hasFilters) {
      throw new Error(
        'Please specify a geographic region or search filters to narrow your search.',
      );
    }

    // For very large searches without specific location, require some filtering
    if (
      optimization.areaSize > 1000000 &&
      !optimization.hasTextSearch &&
      !args.requiredSports?.length
    ) {
      throw new Error(
        'For very large geographic searches, please add sport filters or a search term to improve performance.',
      );
    }
  }

  // Calculate optimal result limit based on search complexity
  private calculateOptimalLimit(
    args: LocationsArgs,
    optimization: ReturnType<typeof this.analyzeSearchComplexity>,
  ): number {
    const requestedLimit = args.first ?? 20;

    // Base limits by complexity
    const maxLimits = {
      low: 100, // Small areas can handle larger result sets
      medium: 75, // Medium areas get reasonable limits
      high: 50, // Large areas get smaller limits for performance
      extreme: 25, // Extreme complexity gets minimal results
    };

    // Text search and filters allow higher limits due to better selectivity
    let adjustedMax = maxLimits[optimization.complexity];
    if (optimization.hasTextSearch)
      adjustedMax = Math.min(adjustedMax * 2, 100);
    if (optimization.hasFilters) adjustedMax = Math.min(adjustedMax * 1.5, 100);

    return Math.min(requestedLimit, adjustedMax);
  }
}

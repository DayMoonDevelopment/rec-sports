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
    const { client } = this.databaseService;

    const limit = args.first ?? 20;
    const hasTextSearch = Boolean(args.query?.trim());

    let query = client
      .selectFrom('locations')
      .selectAll()
      .select(['created_at']);

    // Add search ranking if there's a text query
    if (hasTextSearch) {
      const searchRank = this.buildSearchRankExpression(
        args.query!,
        args.searchMode || 'combined',
        args.similarityThreshold || 0.3,
      );
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

    // Get total count with a separate simpler query
    let countQuery = client
      .selectFrom('locations')
      .select((eb) => eb.fn.count('id').as('count'));

    // Apply the same filters to count query
    if (filterExpressions.length > 0) {
      countQuery = countQuery.where((eb) => eb.and(filterExpressions));
    }

    const [results, countResult] = await Promise.all([
      query.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count ?? 0);
    const hasNextPage = results.length > limit;
    const nodes = results.slice(0, limit);

    // Transform database results to GraphQL types and create edges
    const edges: LocationEdge[] = nodes.map((row) => {
      const location: Location = {
        id: row.id,
        name: row.name || 'Unknown Location',
        address: this.buildAddress(row),
        geo: {
          latitude: row.lat,
          longitude: row.lon,
        },
        sports: (row.sport_tags || []).map((tag) => tag.toUpperCase() as Sport),
        bounds: (
          row.bounds as { geometry: { lat: number; lon: number }[] }
        ).geometry.map((g) => ({ latitude: g.lat, longitude: g.lon })),
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

    if (args.sports?.length) {
      expressions.push(this.createSportsFilter(args.sports));
    }

    if (args.query) {
      expressions.push(
        this.createTextSearchFilter(
          args.query,
          args.searchMode,
          args.similarityThreshold,
        ),
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
    return sql<boolean>`sport_tags && ${JSON.stringify(sportTags)}::text[]`;
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
        args.searchMode || 'combined',
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
          searchMode: args.searchMode,
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
    return sql<boolean>`gis.ST_Within(
      geo::gis.geometry,
      gis.ST_MakeEnvelope(${sql.literal(southWest.longitude)}, ${sql.literal(southWest.latitude)}, ${sql.literal(northEast.longitude)}, ${sql.literal(northEast.latitude)}, 4326)
    )`;
  }

  private createRadiusFilter(centerPoint: {
    point: { latitude: number; longitude: number };
    radiusMiles: number;
  }): Expression<SqlBool> {
    const { point, radiusMiles } = centerPoint;
    // Convert miles to meters: 1 mile = 1609.344 meters
    const radiusMeters = radiusMiles * 1609.344;
    return sql<boolean>`gis.ST_DWithin(
      geo::gis.geography,
      gis.ST_SetSRID(gis.ST_MakePoint(${sql.literal(point.longitude)}, ${sql.literal(point.latitude)}), 4326)::gis.geography,
      ${sql.literal(radiusMeters)}
    )`;
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
}

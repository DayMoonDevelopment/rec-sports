import { Injectable } from '@nestjs/common';
import { Expression, sql } from 'kysely';

import { DatabaseService } from '../database/database.service';
import { LocationsResponse } from './dto/locations-response.dto';
import { LocationsArgs } from './dto/locations.args';
import { Sport } from './enums/sport.enum';
import { Location } from './models/location.model';

import type { SqlBool } from 'kysely';

@Injectable()
export class LocationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findLocationById(id: string): Promise<Location | null> {
    const { client } = this.databaseService;

    const result = await client
      .selectFrom('locations')
      .selectAll()
      .select([
        sql<number>`gis.st_x(location::gis.geometry)`.as('longitude'),
        sql<number>`gis.st_y(location::gis.geometry)`.as('latitude'),
      ])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    // Transform database result to GraphQL type
    return {
      id: result.id,
      name: result.name,
      address: this.buildAddress(result),
      geo: {
        latitude: result.latitude,
        longitude: result.longitude,
      },
      sports: (result.sport_tags || []).map(
        (tag) => tag.toUpperCase() as Sport,
      ),
    };
  }

  async findLocations(args: LocationsArgs): Promise<LocationsResponse> {
    const { client } = this.databaseService;
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 20;

    let query = client
      .selectFrom('locations')
      .selectAll()
      .select([
        sql<number>`gis.st_x(location::gis.geometry)`.as('longitude'),
        sql<number>`gis.st_y(location::gis.geometry)`.as('latitude'),
      ]);

    // Apply filters using composable approach
    const filterExpressions = this.buildFilterExpressions(args);
    if (filterExpressions.length > 0) {
      query = query.where((eb) => eb.and(filterExpressions));
    }

    // Get total count
    const countQuery = query
      .clearSelect()
      .select((eb) => eb.fn.count('id').as('count'));
    const countResult = await countQuery.executeTakeFirst();
    const totalCount = Number(countResult?.count ?? 0);

    // Apply pagination and get results
    const results = await query.offset(offset).limit(limit).execute();

    // Transform database results to GraphQL types
    const nodes = results.map((row) => ({
      id: row.id,
      name: row.name,
      address: this.buildAddress(row),
      geo: {
        latitude: row.latitude,
        longitude: row.longitude,
      },
      sports: (row.sport_tags || []).map((tag) => tag.toUpperCase() as Sport),
    }));

    return {
      nodes,
      totalCount,
      hasMore: offset + limit < totalCount,
    };
  }

  private buildFilterExpressions(args: LocationsArgs): Expression<SqlBool>[] {
    const expressions: Expression<SqlBool>[] = [];

    if (args.sports?.length) {
      expressions.push(this.createSportsFilter(args.sports));
    }

    if (args.query) {
      expressions.push(this.createTextSearchFilter(args.query));
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

  private createTextSearchFilter(query: string): Expression<SqlBool> {
    const searchTerm = `%${query}%`;
    return sql<boolean>`(
      name ILIKE ${searchTerm} OR
      city ILIKE ${searchTerm} OR
      state ILIKE ${searchTerm}
    )`;
  }

  private createBoundingBoxFilter(boundingBox: {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  }): Expression<SqlBool> {
    const { northEast, southWest } = boundingBox;
    return sql<boolean>`gis.ST_Within(
      location::gis.geometry,
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
      location::gis.geography,
      gis.ST_SetSRID(gis.ST_MakePoint(${sql.literal(point.longitude)}, ${sql.literal(point.latitude)}), 4326)::gis.geography,
      ${sql.literal(radiusMeters)}
    )`;
  }

  private extractLatitude(location: unknown): number {
    if (!location) return 0;

    // Handle PostGIS POINT geometry
    // PostGIS returns POINT(longitude latitude) format
    const locationStr = String(location);
    const pointMatch = locationStr.match(/POINT\(([\d.-]+)\s+([\d.-]+)\)/);
    if (pointMatch) {
      const [, , latitude] = pointMatch;
      return Number(latitude);
    }

    // Handle binary/hex format (WKB)
    if (locationStr.startsWith('0101000000')) {
      // For WKB format, you would need a proper parser
      // This is a placeholder for proper WKB parsing
      console.warn('WKB format detected, consider using ST_AsText in query');
      return 0;
    }

    return 0;
  }

  private extractLongitude(location: unknown): number {
    if (!location) return 0;

    // Handle PostGIS POINT geometry
    // PostGIS returns POINT(longitude latitude) format
    const locationStr = String(location);
    const pointMatch = locationStr.match(/POINT\(([\d.-]+)\s+([\d.-]+)\)/);
    if (pointMatch) {
      const [, longitude] = pointMatch;
      return Number(longitude);
    }

    // Handle binary/hex format (WKB)
    if (locationStr.startsWith('0101000000')) {
      // For WKB format, you would need a proper parser
      // This is a placeholder for proper WKB parsing
      console.warn('WKB format detected, consider using ST_AsText in query');
      return 0;
    }

    return 0;
  }

  // Alternative method: Use ST_X and ST_Y in the query for better performance
  async findLocationsWithCoordinates(
    args: LocationsArgs,
  ): Promise<LocationsResponse> {
    const { client } = this.databaseService;
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 20;

    let query = client
      .selectFrom('locations')
      .select([
        'id',
        'name',
        'street',
        'city',
        'state',
        'country',
        'postal_code',
        'sport_tags',
        sql<number>`gis.ST_X(location::gis.geometry)`.as('longitude'),
        sql<number>`gis.ST_Y(location::gis.geometry)`.as('latitude'),
      ]);

    // Apply filters using composable approach
    const filterExpressions = this.buildFilterExpressions(args);
    if (filterExpressions.length > 0) {
      query = query.where((eb) => eb.and(filterExpressions));
    }

    // Get total count
    const countQuery = client
      .selectFrom('locations')
      .select((eb) => eb.fn.count('id').as('count'));

    if (filterExpressions.length > 0) {
      countQuery.where((eb) => eb.and(filterExpressions));
    }

    const countResult = await countQuery.executeTakeFirst();
    const totalCount = Number(countResult?.count ?? 0);

    // Apply pagination and get results
    const results = await query.offset(offset).limit(limit).execute();

    // Transform database results to GraphQL types
    const nodes = results.map((row) => ({
      id: row.id,
      name: row.name,
      address: this.buildAddress(row),
      geo: {
        latitude: row.latitude || 0,
        longitude: row.longitude || 0,
      },
      sports: (row.sport_tags || []).map((tag) => tag.toUpperCase() as Sport),
    }));

    return {
      nodes,
      totalCount,
      hasMore: offset + limit < totalCount,
    };
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

    // Generate state code from state name
    const stateCode = this.getStateCode(row.state);

    return {
      id: row.id,
      street: row.street,
      street2: null, // Database doesn't have street2 field yet
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      stateCode,
    };
  }

  private getStateCode(stateName: string): string {
    if (!stateName) {
      return '';
    }

    const normalizedState = stateName.trim();

    // If it's already a 2-letter code, return it
    if (normalizedState.length === 2 && /^[A-Z]{2}$/.test(normalizedState)) {
      return normalizedState;
    }

    const STATE_NAME_TO_CODE: Record<string, string> = {
      Alabama: 'AL',
      Alaska: 'AK',
      Arizona: 'AZ',
      Arkansas: 'AR',
      California: 'CA',
      Colorado: 'CO',
      Connecticut: 'CT',
      Delaware: 'DE',
      Florida: 'FL',
      Georgia: 'GA',
      Hawaii: 'HI',
      Idaho: 'ID',
      Illinois: 'IL',
      Indiana: 'IN',
      Iowa: 'IA',
      Kansas: 'KS',
      Kentucky: 'KY',
      Louisiana: 'LA',
      Maine: 'ME',
      Maryland: 'MD',
      Massachusetts: 'MA',
      Michigan: 'MI',
      Minnesota: 'MN',
      Mississippi: 'MS',
      Missouri: 'MO',
      Montana: 'MT',
      Nebraska: 'NE',
      Nevada: 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      Ohio: 'OH',
      Oklahoma: 'OK',
      Oregon: 'OR',
      Pennsylvania: 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      Tennessee: 'TN',
      Texas: 'TX',
      Utah: 'UT',
      Vermont: 'VT',
      Virginia: 'VA',
      Washington: 'WA',
      'West Virginia': 'WV',
      Wisconsin: 'WI',
      Wyoming: 'WY',
      'District of Columbia': 'DC',
      'Puerto Rico': 'PR',
      'U.S. Virgin Islands': 'VI',
      Guam: 'GU',
      'American Samoa': 'AS',
      'Northern Mariana Islands': 'MP',
    };

    // Look up the state name in our mapping
    return STATE_NAME_TO_CODE[normalizedState] || normalizedState;
  }
}

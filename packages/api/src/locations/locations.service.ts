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
      address: {
        street: result.street,
        city: result.city,
        county: result.county,
        state: result.state,
        country: result.country,
        postalCode: result.postal_code,
      },
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
    const offset = args.page?.offset ?? 0;
    const limit = args.page?.limit ?? 20;

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
      address: {
        street: row.street,
        city: row.city,
        county: row.county,
        state: row.state,
        country: row.country,
        postalCode: row.postal_code,
      },
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
    return sql<boolean>`ST_Within(
      location,
      ST_MakeEnvelope(${southWest.longitude}, ${southWest.latitude}, ${northEast.longitude}, ${northEast.latitude}, 4326)
    )`;
  }

  private createRadiusFilter(centerPoint: {
    point: { latitude: number; longitude: number };
    radiusMiles: number;
  }): Expression<SqlBool> {
    const { point, radiusMiles } = centerPoint;
    // Convert miles to meters: 1 mile = 1609.344 meters
    const radiusMeters = radiusMiles * 1609.344;
    return sql<boolean>`ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint(${point.longitude}, ${point.latitude}), 4326)::geography,
      ${radiusMeters}
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
    const offset = args.page?.offset ?? 0;
    const limit = args.page?.limit ?? 20;

    let query = client
      .selectFrom('locations')
      .select([
        'id',
        'name',
        'street',
        'city',
        'county',
        'state',
        'country',
        'postal_code',
        'sport_tags',
        sql<number>`ST_X(location)`.as('longitude'),
        sql<number>`ST_Y(location)`.as('latitude'),
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
      address: {
        street: row.street,
        city: row.city,
        county: row.county,
        state: row.state,
        country: row.country,
        postalCode: row.postal_code,
      },
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
}

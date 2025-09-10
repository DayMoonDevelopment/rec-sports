import { Injectable } from '@nestjs/common';

import { Sport } from '../../common/enums/sport.enum';
import { DatabaseService } from '../../database/database.service';
import { Facility } from './models/facility.model';

@Injectable()
export class FacilitiesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findFacilityById(id: string): Promise<Facility | null> {
    const { client } = this.databaseService;

    const result = await client
      .selectFrom('location_facilities')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      locationId: result.location_id,
      sport: result.sport.toUpperCase() as Sport,
      geo: {
        latitude: result.lat,
        longitude: result.lon,
      },
      bounds: (
        result.bounds as { geometry: { lat: number; lon: number }[] }
      ).geometry.map((g) => ({ latitude: g.lat, longitude: g.lon })),
    };
  }

  async findFacilitiesByLocationId(locationId: string): Promise<Facility[]> {
    const { client } = this.databaseService;

    const results = await client
      .selectFrom('location_facilities')
      .selectAll()
      .where('location_id', '=', locationId)
      .execute();

    return results.map((result) => ({
      id: result.id,
      locationId: result.location_id,
      sport: result.sport.toUpperCase() as Sport,
      geo: {
        latitude: result.lat,
        longitude: result.lon,
      },
      bounds: (
        result.bounds as { geometry: { lat: number; lon: number }[] }
      ).geometry.map((g) => ({ latitude: g.lat, longitude: g.lon })),
    }));
  }
}

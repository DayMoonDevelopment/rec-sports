import { Args, Query, Resolver } from '@nestjs/graphql';

import { LocationsService } from './locations.service';
import { LocationsArgs } from './dto/locations.args';
import { LocationsResponse } from './dto/locations-response.dto';
import { Location } from './models/location.model';

@Resolver()
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => LocationsResponse)
  async locations(@Args() args: LocationsArgs): Promise<LocationsResponse> {
    return this.locationsService.findLocations(args);
  }

  @Query(() => Location, { nullable: true })
  async location(@Args('id') id: string): Promise<Location | null> {
    return this.locationsService.findLocationById(id);
  }
}

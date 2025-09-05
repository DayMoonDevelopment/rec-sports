import { Args, Query, Resolver } from '@nestjs/graphql';

import { LocationsArgs } from './dto/locations.args';
import { LocationsService } from './locations.service';
import { Location } from './models/location.model';
import { LocationsConnection } from './models/locations-connection.model';

@Resolver()
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => LocationsConnection)
  async locations(@Args() args: LocationsArgs): Promise<LocationsConnection> {
    return this.locationsService.findLocations(args);
  }

  @Query(() => Location, { nullable: true })
  async location(@Args('id') id: string): Promise<Location | null> {
    return this.locationsService.findLocationById(id);
  }
}

import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';

import { LocationsArgs } from './dto/locations.args';
import { FacilitiesService } from './facilities/facilities.service';
import { LocationsService } from './locations.service';
import { Facility } from './facilities/models/facility.model';
import { Location } from './models/location.model';
import { LocationsConnection } from './models/locations-connection.model';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly facilitiesService: FacilitiesService,
  ) {}

  @Query(() => LocationsConnection)
  async locations(@Args() args: LocationsArgs): Promise<LocationsConnection> {
    return this.locationsService.findLocations(args);
  }

  @Query(() => Location, { nullable: true })
  async location(@Args('id') id: string): Promise<Location | null> {
    return this.locationsService.findLocationById(id);
  }

  @ResolveField(() => [Facility], { nullable: true })
  async facilities(@Parent() location: Location): Promise<Facility[]> {
    return this.facilitiesService.findFacilitiesByLocationId(location.id);
  }
}

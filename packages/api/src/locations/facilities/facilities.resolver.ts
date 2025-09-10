import { Args, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';

import { FacilitiesService } from './facilities.service';
import { LocationsService } from '../locations.service';
import { Facility } from './models/facility.model';
import { Location } from '../models/location.model';

@Resolver(() => Facility)
export class FacilitiesResolver {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly locationsService: LocationsService,
  ) {}

  @Query(() => Facility, { nullable: true })
  async facility(@Args('id') id: string): Promise<Facility | null> {
    return this.facilitiesService.findFacilityById(id);
  }

  @ResolveField(() => Location, { nullable: true })
  async location(@Parent() facility: Facility): Promise<Location | null> {
    return this.locationsService.findLocationById(facility.locationId);
  }
}

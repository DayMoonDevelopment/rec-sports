import { Args, Query, Resolver } from '@nestjs/graphql';

import { FacilitiesService } from './facilities.service';
import { Facility } from './models/facility.model';

@Resolver(() => Facility)
export class FacilitiesResolver {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Query(() => Facility, { nullable: true })
  async facility(@Args('id') id: string): Promise<Facility | null> {
    return this.facilitiesService.findFacilityById(id);
  }
}

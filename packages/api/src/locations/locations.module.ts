import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AddressModule } from './address';
import { FacilitiesResolver } from './facilities/facilities.resolver';
import { FacilitiesService } from './facilities/facilities.service';
import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';

@Module({
  imports: [DatabaseModule, AddressModule],
  providers: [
    LocationsService,
    LocationsResolver,
    FacilitiesService,
    FacilitiesResolver,
  ],
  exports: [LocationsService, FacilitiesService],
})
export class LocationsModule {}

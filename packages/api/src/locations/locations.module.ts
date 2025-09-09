import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AddressModule } from './address';
import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';

@Module({
  imports: [DatabaseModule, AddressModule],
  providers: [LocationsService, LocationsResolver],
  exports: [LocationsService],
})
export class LocationsModule {}

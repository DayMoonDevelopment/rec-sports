import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';
import { AddressResolver } from './resolvers/address.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [LocationsService, LocationsResolver, AddressResolver],
  exports: [LocationsService],
})
export class LocationsModule {}

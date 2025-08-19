import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';

@Module({
  imports: [DatabaseModule],
  providers: [LocationsService, LocationsResolver],
  exports: [LocationsService],
})
export class LocationsModule {}

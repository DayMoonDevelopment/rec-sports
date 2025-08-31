import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { GamesResolver, TeamsResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  imports: [DatabaseModule],
  providers: [GamesService, GamesResolver, TeamsResolver],
  exports: [GamesService],
})
export class GamesModule {}
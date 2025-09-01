import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { SupabaseService } from '../lib/supabase.service';
import { GamesResolver, TeamsResolver, GameEventsResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  imports: [DatabaseModule],
  providers: [GamesService, SupabaseService, GamesResolver, TeamsResolver, GameEventsResolver],
  exports: [GamesService],
})
export class GamesModule {}
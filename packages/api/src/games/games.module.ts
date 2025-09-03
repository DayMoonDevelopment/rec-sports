import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { SupabaseService } from '../lib/supabase.service';
import { TeamsModule } from '../teams/teams.module';
import { ActionsModule } from './actions/actions.module';
import { GamesResolver } from './games.resolver';
import { GamesService } from './games.service';

@Module({
  imports: [DatabaseModule, TeamsModule, ActionsModule],
  providers: [GamesService, SupabaseService, GamesResolver],
  exports: [GamesService],
})
export class GamesModule {}

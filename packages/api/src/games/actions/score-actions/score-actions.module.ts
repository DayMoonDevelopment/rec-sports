import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '../../../database/database.module';
import { TeamsModule } from '../../../teams/teams.module';
import { GamesModule } from '../../games.module';
import { ScoreActionsResolver, AddGameScorePayloadResolver } from './score-actions.resolver';
import { ScoreActionsService } from './score-actions.service';

@Module({
  imports: [DatabaseModule, TeamsModule, forwardRef(() => GamesModule)],
  providers: [ScoreActionsService, ScoreActionsResolver, AddGameScorePayloadResolver],
  exports: [ScoreActionsService],
})
export class ScoreActionsModule {}

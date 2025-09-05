import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { ActionsService } from './actions.service';
import { GameActionResolver } from './game-action.resolver';
import { ScoreActionsModule } from './score-actions/score-actions.module';

@Module({
  imports: [DatabaseModule, ScoreActionsModule],
  providers: [ActionsService, GameActionResolver],
  exports: [ActionsService, ScoreActionsModule],
})
export class ActionsModule {}

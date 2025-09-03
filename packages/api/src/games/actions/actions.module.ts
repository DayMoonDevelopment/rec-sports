import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { ActionsService } from './actions.service';
import { ScoreActionsModule } from './score-actions/score-actions.module';

@Module({
  imports: [DatabaseModule, ScoreActionsModule],
  providers: [ActionsService],
  exports: [ActionsService, ScoreActionsModule],
})
export class ActionsModule {}

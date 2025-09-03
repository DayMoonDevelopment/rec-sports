import { Field, ObjectType } from '@nestjs/graphql';
import { GameScoreAction } from '../models/game-score-action.model';

@ObjectType()
export class UpdateGameScorePayload {
  @Field(() => GameScoreAction)
  action: GameScoreAction;
}

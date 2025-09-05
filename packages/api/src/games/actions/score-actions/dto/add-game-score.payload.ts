import { Field, ObjectType } from '@nestjs/graphql';
import { Game } from '../../../models/game.model';
import { GameScoreAction } from '../models/game-score-action.model';

@ObjectType()
export class AddGameScorePayload {
  @Field(() => Game)
  game: Game;

  @Field(() => GameScoreAction)
  action: GameScoreAction;
}
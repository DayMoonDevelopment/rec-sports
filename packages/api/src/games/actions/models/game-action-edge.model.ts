import { Field, ObjectType } from '@nestjs/graphql';
import { GameAction } from './game-action.interface';

@ObjectType()
export class GameActionEdge {
  @Field(() => GameAction)
  node: GameAction;

  @Field()
  cursor: string;
}
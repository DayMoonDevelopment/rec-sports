import { Field, ObjectType } from '@nestjs/graphql';
import { Game } from './game.model';

@ObjectType()
export class GameEdge {
  @Field(() => Game)
  node: Game;

  @Field()
  cursor: string;
}
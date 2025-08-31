import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Game } from '../models/game.model';

@ObjectType()
export class GamesResponse {
  @Field(() => [Game])
  nodes: Game[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Boolean)
  hasMore: boolean;
}
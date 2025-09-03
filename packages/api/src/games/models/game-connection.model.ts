import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from '../../common/pagination/page-info.model';
import { Game } from './game.model';
import { GameEdge } from './game-edge.model';

@ObjectType()
export class GameConnection {
  @Field(() => [Game])
  nodes: Game[];

  @Field(() => [GameEdge])
  edges: GameEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../common/pagination/page-info.model';
import { GameEdge } from './game-edge.model';

@ObjectType()
export class GamesConnection {
  @Field(() => [GameEdge])
  edges: GameEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}

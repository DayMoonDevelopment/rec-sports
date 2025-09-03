import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../../common/pagination/page-info.model';
import { GameActionEdge } from './game-action-edge.model';

@ObjectType()
export class GameActionsConnection {
  @Field(() => [GameActionEdge])
  edges: GameActionEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}

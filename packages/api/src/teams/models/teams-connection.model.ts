import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../common/pagination/page-info.model';
import { TeamEdge } from './team-edge.model';

@ObjectType()
export class TeamsConnection {
  @Field(() => [TeamEdge])
  edges: TeamEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field()
  totalCount: number;
}

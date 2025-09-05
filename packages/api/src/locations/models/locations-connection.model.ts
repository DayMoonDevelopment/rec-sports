import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../common/pagination/page-info.model';
import { LocationEdge } from './location-edge.model';

@ObjectType()
export class LocationsConnection {
  @Field(() => [LocationEdge])
  edges: LocationEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}

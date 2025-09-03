import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';

import { PageInfo } from '../../common/pagination/page-info.model';
import { Location } from '../models/location.model';

@ObjectType()
export class LocationsResponse {
  @Field(() => [Location])
  @IsArray()
  @IsNotEmpty()
  nodes: Location[];

  @Field(() => Int)
  @IsInt()
  @Min(0)
  totalCount: number;

  @Field()
  @IsBoolean()
  hasMore: boolean;

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

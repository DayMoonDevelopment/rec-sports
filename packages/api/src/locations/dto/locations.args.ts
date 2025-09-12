import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { Sport } from '../../common/enums/sport.enum';
import { Region } from './region.input';

@ArgsType()
export class LocationsArgs {
  // Pagination - cursor-based
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  after?: string;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  first?: number = 20;

  // Geographic region filter
  @Field(() => Region, { nullable: true })
  @ValidateNested()
  @Type(() => Region)
  @IsOptional()
  region?: Region;

  // Filter by required sports
  @Field(() => [Sport], { nullable: true })
  @IsOptional()
  @IsArray()
  requiredSports?: Sport[];

  // Text search query
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string;
}

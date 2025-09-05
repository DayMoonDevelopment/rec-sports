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

  // Filter by sports
  @Field(() => [Sport], { nullable: true })
  @IsOptional()
  @IsArray()
  sports?: Sport[];

  // Text search query
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string;

  // Search mode for different query types
  @Field({ nullable: true, defaultValue: 'combined' })
  @IsOptional()
  @IsString()
  searchMode?: 'exact' | 'fuzzy' | 'phrase' | 'combined' = 'combined';

  // Minimum similarity threshold for fuzzy search (0.0 to 1.0)
  @Field({ nullable: true, defaultValue: 0.3 })
  @IsOptional()
  @Min(0)
  @Max(1)
  similarityThreshold?: number = 0.3;
}

import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Sport } from '../enums/sport.enum';
import { Page } from './page.input';
import { Region } from './region.input';

@ArgsType()
export class LocationsArgs {
  // Pagination
  @Field(() => Page, { nullable: true })
  @ValidateNested()
  @Type(() => Page)
  @IsOptional()
  page?: Page;

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
}

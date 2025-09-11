import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { Sport } from '../../common/enums/sport.enum';
import { Address } from '../address';
import { Facility } from '../facilities/models/facility.model';
import { Point } from './point.model';

@ObjectType()
export class Location {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => Address, { nullable: true })
  @ValidateNested()
  @Type(() => Address)
  address?: Address;

  @Field(() => Point)
  @ValidateNested()
  @Type(() => Point)
  @IsNotEmpty()
  geo: Point;

  @Field(() => [Sport])
  @IsArray()
  @IsNotEmpty()
  sports: Sport[];

  @Field(() => [Point])
  @IsArray()
  @IsNotEmpty()
  bounds: Point[];

  @Field(() => [Facility], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Facility)
  facilities?: Facility[];
}

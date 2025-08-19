import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Sport } from '../enums/sport.enum';
import { Address } from './address.model';
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
}

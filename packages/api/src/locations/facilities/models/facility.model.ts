import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { Sport } from '../../../common/enums/sport.enum';
import { Point } from '../../models/point.model';

@ObjectType()
export class Facility {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => Sport)
  @IsNotEmpty()
  sport: Sport;

  @Field(() => Point)
  @ValidateNested()
  @Type(() => Point)
  @IsNotEmpty()
  geo: Point;

  @Field(() => [Point])
  @IsArray()
  @IsNotEmpty()
  bounds: Point[];
}

import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MutualExclusion } from '../validators/mutual-exclusion.validator';

@InputType()
export class PointInput {
  @Field(() => Float)
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @Field(() => Float)
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}

@InputType()
export class BoundingBox {
  @Field(() => PointInput)
  @ValidateNested()
  @Type(() => PointInput)
  @IsNotEmpty()
  northEast: PointInput;

  @Field(() => PointInput)
  @ValidateNested()
  @Type(() => PointInput)
  @IsNotEmpty()
  southWest: PointInput;
}

@InputType()
export class CenterPoint {
  @Field(() => PointInput)
  @ValidateNested()
  @Type(() => PointInput)
  @IsNotEmpty()
  point: PointInput;

  @Field(() => Float)
  @IsPositive()
  @IsNotEmpty()
  radiusMiles: number;
}

@InputType()
@MutualExclusion(['boundingBox', 'centerPoint'], {
  message: 'You must provide either a boundingBox or centerPoint, but not both',
})
export class Region {
  @Field(() => BoundingBox, { nullable: true })
  @ValidateNested()
  @Type(() => BoundingBox)
  @IsOptional()
  boundingBox?: BoundingBox;

  @Field(() => CenterPoint, { nullable: true })
  @ValidateNested()
  @Type(() => CenterPoint)
  @IsOptional()
  centerPoint?: CenterPoint;
}

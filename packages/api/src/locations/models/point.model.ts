import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

@ObjectType()
export class Point {
  @Field(() => Float)
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @Field(() => Float)
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}
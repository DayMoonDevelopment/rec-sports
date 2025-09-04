import { Field, ObjectType } from '@nestjs/graphql';
import { Location } from './location.model';

@ObjectType()
export class LocationEdge {
  @Field(() => Location)
  node: Location;

  @Field()
  cursor: string;
}

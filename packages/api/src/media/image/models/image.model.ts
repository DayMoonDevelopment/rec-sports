import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Media } from '../../models/media.interface';

@ObjectType({ implements: () => [Media] })
export class Image implements Media {
  @Field()
  source: string;

  @Field({ nullable: true })
  blurHash?: string;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { nullable: true })
  width?: number;
}

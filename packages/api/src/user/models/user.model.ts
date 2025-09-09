import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Image } from '../../media/image/models/image.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => Image, { nullable: true })
  photo?: Image;

  @Field({ nullable: true })
  displayName?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  authId?: string;
}

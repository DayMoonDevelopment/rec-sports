import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Session {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => Int)
  expiresIn: number;

  @Field(() => Int)
  expiresAt: number;

  @Field()
  tokenType: string;
}
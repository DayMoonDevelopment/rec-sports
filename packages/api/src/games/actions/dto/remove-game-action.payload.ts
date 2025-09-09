import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveGameActionPayload {
  @Field(() => ID)
  gameId: string;

  @Field()
  success: boolean;
}

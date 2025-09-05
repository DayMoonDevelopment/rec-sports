import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class GameAction {
  @Field(() => ID)
  id: string;

  @Field()
  occurredAt: Date;
}
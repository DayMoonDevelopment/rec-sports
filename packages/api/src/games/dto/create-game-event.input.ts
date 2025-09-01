import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGameEventInput {
  @Field()
  gameId: string;

  @Field()
  teamId: string;

  @Field()
  eventType: string;

  @Field()
  points: number;

  @Field({ nullable: true })
  description?: string;
}
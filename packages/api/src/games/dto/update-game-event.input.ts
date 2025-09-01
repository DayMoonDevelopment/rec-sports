import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateGameEventInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  eventType?: string;

  @Field({ nullable: true })
  points?: number;

  @Field({ nullable: true })
  description?: string;
}
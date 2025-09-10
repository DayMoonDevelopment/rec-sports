import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SuggestedTeamsArgs {
  @Field(() => Int, { defaultValue: 20 })
  first: number;

  @Field({ nullable: true })
  after?: string;
}

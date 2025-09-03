import { Field, ID, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class GameScoreInput {
  @Field(() => ID)
  @IsNotEmpty()
  occurredByTeamMemberId: string;

  @Field(() => Float)
  @IsNotEmpty()
  value: number;

  @Field()
  @IsNotEmpty()
  key: string;
}
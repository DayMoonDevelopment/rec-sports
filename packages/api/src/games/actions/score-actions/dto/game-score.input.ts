import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class GameScoreInput {
  @Field(() => ID, { nullable: true })
  occurredByUserId?: string;

  @Field(() => ID)
  @IsNotEmpty()
  occurredToTeamId: string;

  @Field(() => Float)
  @IsNotEmpty()
  value: number;

  @Field({ nullable: true })
  key?: string;
}

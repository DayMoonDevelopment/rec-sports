import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTeamInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => [ID])
  @IsArray()
  @IsNotEmpty()
  members: string[];
}
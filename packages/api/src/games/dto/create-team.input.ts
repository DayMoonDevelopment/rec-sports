import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

import { TeamType } from '../enums/team-type.enum';

@InputType()
export class CreateTeamInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => TeamType)
  @IsNotEmpty()
  teamType: TeamType;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  sportTags?: string[];
}
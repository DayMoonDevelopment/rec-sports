import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

import { TeamType } from '../enums/team-type.enum';

@ObjectType()
export class Team {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
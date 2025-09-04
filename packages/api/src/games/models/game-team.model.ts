import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { Team } from '../../teams/models/team.model';

@ObjectType()
export class GameTeam {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => Team)
  team: Team;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  score?: number;
}

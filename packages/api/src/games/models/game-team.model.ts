import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

import { Team } from '../../teams/models/team.model';

@ObjectType()
export class GameTeam {
  @Field(() => Team)
  team: Team;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  score?: number;
}

import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { Team } from '../../teams/models/team.model';

@ObjectType()
export class GameTeam {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => Team)
  team: Team;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  score: number;
}

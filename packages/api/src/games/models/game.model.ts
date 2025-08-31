import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { Location } from '../../locations/models/location.model';
import { GameState } from '../enums/game-state.enum';
import { Team } from './team.model';

@ObjectType()
export class Game {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => Team, { nullable: true })
  @IsOptional()
  team1?: Team;

  @Field(() => Team, { nullable: true })
  @IsOptional()
  team2?: Team;

  @Field()
  @IsNotEmpty()
  sport: string;

  @Field(() => GameState)
  @IsNotEmpty()
  gameState: GameState;

  @Field({ nullable: true })
  @IsOptional()
  scheduledAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  startedAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  completedAt?: Date;

  @Field(() => Location, { nullable: true })
  @IsOptional()
  location?: Location;

  @Field(() => Int)
  team1Score: number;

  @Field(() => Int)
  team2Score: number;

  @Field(() => Team, { nullable: true })
  @IsOptional()
  winnerTeam?: Team;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
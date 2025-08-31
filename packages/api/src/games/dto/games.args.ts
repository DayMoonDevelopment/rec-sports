import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min, Max } from 'class-validator';

import { GameState } from '../enums/game-state.enum';

@ArgsType()
export class GamesArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  offset?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  sport?: string;

  @Field(() => GameState, { nullable: true })
  @IsOptional()
  gameState?: GameState;

  @Field({ nullable: true })
  @IsOptional()
  teamId?: string;

  @Field({ nullable: true })
  @IsOptional()
  locationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  userId?: string;
}
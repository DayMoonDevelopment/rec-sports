import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { Team } from './team.model';

@ObjectType()
export class GameEvent {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  gameId: string;

  @Field(() => Team, { nullable: true })
  @IsOptional()
  team?: Team;

  @Field({ nullable: true })
  @IsOptional()
  userId?: string;

  @Field()
  @IsNotEmpty()
  eventType: string;

  @Field({ nullable: true })
  @IsOptional()
  eventKey?: string;

  @Field(() => Int)
  points: number;

  @Field(() => Int)
  periodNumber: number;

  @Field({ nullable: true })
  @IsOptional()
  periodName?: string;

  @Field()
  occurredAt: Date;

  @Field()
  createdAt: Date;
}
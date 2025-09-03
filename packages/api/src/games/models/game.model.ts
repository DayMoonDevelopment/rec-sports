import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

import { Sport } from '../../common/enums/sport.enum';
import { Location } from '../../locations/models/location.model';
import { Team } from '../../teams/models/team.model';
import { GameActionsConnection } from '../actions/models/game-actions-connection.model';
import { GameStatus } from '../enums/game-status.enum';

@ObjectType()
export class Game {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => Location, { nullable: true })
  @IsOptional()
  location?: Location;

  @Field(() => Sport)
  @IsNotEmpty()
  sport: Sport;

  @Field(() => [Team])
  @IsArray()
  teams: Team[];

  @Field(() => GameStatus)
  @IsNotEmpty()
  status: GameStatus;

  @Field({ nullable: true })
  @IsOptional()
  scheduledAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  startedAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endedAt?: Date;

  @Field(() => GameActionsConnection)
  actions: GameActionsConnection;
}

import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Team } from '../../../../teams/models/team.model';
import { User } from '../../../../user/models/user.model';
import { GameAction } from '../../models/game-action.interface';

@ObjectType({ implements: () => [GameAction] })
export class GameScoreAction implements GameAction {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  occurredAt: Date;

  @Field(() => User)
  @IsNotEmpty()
  occurredBy: User;

  @Field(() => Team)
  @IsNotEmpty()
  team: Team;

  @Field(() => Float)
  @IsNotEmpty()
  value: number;

  @Field()
  @IsNotEmpty()
  key: string;
}

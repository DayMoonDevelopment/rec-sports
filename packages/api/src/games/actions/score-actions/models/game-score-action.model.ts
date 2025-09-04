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

  @Field(() => User, { nullable: true })
  occurredByUser?: User;

  @Field(() => Team)
  @IsNotEmpty()
  occurredToTeam: Team;

  @Field(() => Float)
  @IsNotEmpty()
  value: number;

  @Field({ nullable: true })
  key?: string;
}

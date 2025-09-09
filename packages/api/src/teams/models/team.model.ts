import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Sport } from '../../common/enums/sport.enum';
import { GamesConnection } from '../../games/models/game-connection.model';
import { User } from '../../user/models/user.model';

@ObjectType()
export class Team {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => [User], { nullable: true })
  @IsArray()
  members?: User[];

  @Field(() => [Sport])
  @IsArray()
  sports: Sport[];

  @Field(() => GamesConnection)
  games: GamesConnection;
}

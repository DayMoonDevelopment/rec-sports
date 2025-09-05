import { Field, ObjectType } from '@nestjs/graphql';
import { Game } from '../models/game.model';

@ObjectType()
export class CreateGamePayload {
  @Field(() => Game)
  game: Game;
}
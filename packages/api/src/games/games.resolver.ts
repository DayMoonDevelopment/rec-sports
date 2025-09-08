import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Sport } from '../common/enums/sport.enum';
import { ActionsService } from './actions/actions.service';
import { GameActionsConnection } from './actions/models/game-actions-connection.model';
import { CreateGameInput } from './dto/create-game.input';
import { CreateGamePayload } from './dto/create-game.payload';
import { UpdateGamePayload } from './dto/update-game.payload';
import { GamesService } from './games.service';
import { Game } from './models/game.model';

@Resolver(() => Game)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly actionsService: ActionsService,
  ) {}

  @Query(() => Game, { nullable: true })
  async game(@Args('id', { type: () => ID }) id: string): Promise<Game | null> {
    return this.gamesService.findGameById(id);
  }

  @Mutation(() => CreateGamePayload)
  async createGame(
    @Args('input') input: CreateGameInput,
  ): Promise<CreateGamePayload> {
    const game = await this.gamesService.createGame(input);
    return { game };
  }

  @Mutation(() => UpdateGamePayload)
  async startGame(
    @Args('gameId', { type: () => ID }) gameId: string,
  ): Promise<UpdateGamePayload> {
    const game = await this.gamesService.startGame(gameId);
    return { game };
  }

  @Mutation(() => UpdateGamePayload)
  async endGame(
    @Args('gameId', { type: () => ID }) gameId: string,
  ): Promise<UpdateGamePayload> {
    const game = await this.gamesService.endGame(gameId);
    return { game };
  }

  @ResolveField(() => GameActionsConnection)
  async actions(
    @Parent() game: Game,
    @Args('first', { type: () => Int, defaultValue: 20 }) first: number,
    @Args('after', { nullable: true }) after?: string,
  ): Promise<GameActionsConnection> {
    return this.actionsService.getGameActions(game.id, first, after);
  }

  @ResolveField(() => Sport, { nullable: true })
  async sport(@Parent() game: Game): Promise<Sport | null> {
    if (!game.sport) {
      return null;
    }

    const normalizedSport = game.sport.toString().toUpperCase();

    if (Object.values(Sport).includes(normalizedSport as Sport)) {
      return normalizedSport as Sport;
    }

    return null;
  }

  @ResolveField(() => Date, { nullable: true })
  async startedAt(@Parent() game: Game): Promise<Date | null> {
    if (game.startedAt) {
      return game.startedAt;
    }

    const gameStartAction = await this.gamesService.getGameStart(game.id);

    return gameStartAction?.occurred_at ? new Date(gameStartAction.occurred_at) : null;
  }

  @ResolveField(() => Date, { nullable: true })
  async endedAt(@Parent() game: Game): Promise<Date | null> {
    if (game.endedAt) {
      return game.endedAt;
    }

    const gameEndAction = await this.gamesService.getGameStart(game.id);

    return gameEndAction?.occurred_at ? new Date(gameEndAction.occurred_at) : null;
  }
}

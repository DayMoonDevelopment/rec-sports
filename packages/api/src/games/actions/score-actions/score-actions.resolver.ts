import {
  Args,
  ID,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { GamesService } from '../../games.service';
import { Game } from '../../models/game.model';
import { AddGameScorePayload } from './dto/add-game-score.payload';
import { GameScoreInput } from './dto/game-score.input';
import { RemoveGameActionPayload } from './dto/remove-game-action.payload';
import { UpdateGameScorePayload } from './dto/update-game-score.payload';
import { GameScoreAction } from './models/game-score-action.model';
import { ScoreActionsService } from './score-actions.service';

@Resolver(() => GameScoreAction)
export class ScoreActionsResolver {
  constructor(private readonly scoreActionsService: ScoreActionsService) {}

  @Mutation(() => AddGameScorePayload)
  async addGameScore(
    @Args('gameId', { type: () => ID }) gameId: string,
    @Args('input') input: GameScoreInput,
  ): Promise<AddGameScorePayload> {
    return this.scoreActionsService.addGameScore(gameId, input);
  }

  @Mutation(() => UpdateGameScorePayload)
  async updateGameScore(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: GameScoreInput,
  ): Promise<UpdateGameScorePayload> {
    return this.scoreActionsService.updateGameScore(id, input);
  }

  @Mutation(() => RemoveGameActionPayload)
  async removeGameAction(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RemoveGameActionPayload> {
    return this.scoreActionsService.removeGameAction(id);
  }

  @ResolveField(() => String, { nullable: true })
  async key(@Parent() action: GameScoreAction): Promise<string | null> {
    // If the key is already set on the action (from the service layer), return it
    if (action.key) {
      return action.key;
    }

    // Fallback to default "SCORE" if no specific key is found
    return 'SCORE';
  }
}

@Resolver(() => AddGameScorePayload)
export class AddGameScorePayloadResolver {
  constructor(private readonly gamesService: GamesService) {}

  @ResolveField(() => Game)
  async game(@Parent() payload: AddGameScorePayload): Promise<Game | null> {
    return this.gamesService.findGameById(payload.game.id);
  }
}

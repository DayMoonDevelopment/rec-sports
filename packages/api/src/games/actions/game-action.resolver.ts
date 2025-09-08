import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

import { ActionsService } from './actions.service';
import { RemoveGameActionPayload } from './dto/remove-game-action.payload';
import { GameAction } from './models/game-action.interface';

@Resolver(() => GameAction)
export class GameActionResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Mutation(() => RemoveGameActionPayload)
  async removeGameAction(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RemoveGameActionPayload> {
    return this.actionsService.removeGameAction(id);
  }

  __resolveType(value: GameAction): string {
    // For now, we only have GameScoreAction, but this can be extended
    // when more GameAction implementations are added
    if ('value' in value && 'key' in value && 'occurredToTeam' in value) {
      return 'GameScoreAction';
    }

    // Default fallback
    return 'GameScoreAction';
  }
}

import { Resolver } from '@nestjs/graphql';

import { GameAction } from './models/game-action.interface';

@Resolver(() => GameAction)
export class GameActionResolver {
  __resolveType(value: GameAction): string {
    // For now, we only have GameScoreAction, but this can be extended
    // when more GameAction implementations are added
    if (
      'value' in value &&
      'key' in value &&
      'team' in value &&
      'occurredBy' in value
    ) {
      return 'GameScoreAction';
    }

    // Default fallback
    return 'GameScoreAction';
  }
}

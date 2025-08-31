import { registerEnumType } from '@nestjs/graphql';

export enum GameState {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

registerEnumType(GameState, {
  name: 'GameState',
  description: 'The state of a game',
});
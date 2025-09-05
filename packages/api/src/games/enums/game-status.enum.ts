import { registerEnumType } from '@nestjs/graphql';

export enum GameStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

registerEnumType(GameStatus, {
  name: 'GameStatus',
  description: 'The status of a game',
});
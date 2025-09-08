import { Injectable } from '@nestjs/common';

import { CursorUtil } from '../../common/pagination/cursor.util';
import { PageInfo } from '../../common/pagination/page-info.model';
import { DatabaseService } from '../../database/database.service';
import { RemoveGameActionPayload } from './dto/remove-game-action.payload';
import { GameActionEdge } from './models/game-action-edge.model';
import { GameActionsConnection } from './models/game-actions-connection.model';
import { GameScoreAction } from './score-actions/models/game-score-action.model';

@Injectable()
export class ActionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Recalculates and updates the score for a specific team in a game
   * based on all SCORE-type actions in the game_actions table.
   *
   * @param gameId - The game ID to update scores for
   * @param teamId - The team ID to update the score for
   */
  private async recalculateTeamScore(
    gameId: string,
    teamId: string,
  ): Promise<void> {
    const { client } = this.databaseService;

    // Calculate the total score for the team from all SCORE actions
    const scoreResult = await client
      .selectFrom('game_actions')
      .select([(eb) => eb.fn.sum('point_value').as('total_score')])
      .where('game_id', '=', gameId)
      .where('occurred_to_team_id', '=', teamId)
      .where('type', '=', 'SCORE')
      .where('point_value', 'is not', null)
      .executeTakeFirst();

    const totalScore = Number(scoreResult?.total_score || 0);

    // Update the team's score in the game_teams table
    await client
      .updateTable('game_teams')
      .set({
        score: totalScore,
        updated_at: new Date().toISOString(),
      })
      .where('game_id', '=', gameId)
      .where('team_id', '=', teamId)
      .execute();
  }

  async getGameActions(
    gameId: string,
    first: number,
    after?: string,
  ): Promise<GameActionsConnection> {
    const { client } = this.databaseService;

    let query = client
      .selectFrom('game_actions')
      .leftJoin('teams', 'teams.id', 'game_actions.occurred_to_team_id')
      .select([
        'game_actions.id',
        'game_actions.occurred_at',
        'game_actions.point_value as value',
        'game_actions.details',
        'game_actions.occurred_by_user_id as user_id',
        'teams.id as team_id',
        'teams.name as team_name',
      ])
      .where('game_actions.game_id', '=', gameId)
      .where('game_actions.type', '=', 'SCORE')
      .orderBy('game_actions.occurred_at', 'desc');

    if (after) {
      const { timestamp } = CursorUtil.parseCursor(after);
      if (timestamp) {
        query = query.where(
          'game_actions.occurred_at',
          '<',
          new Date(timestamp).toISOString(),
        );
      }
    }

    query = query.limit(first + 1);

    const results = await query.execute();
    const hasNextPage = results.length > first;
    const nodes = results.slice(0, first);

    const edges: GameActionEdge[] = nodes.map((result) => {
      const gameScoreAction = new GameScoreAction();
      gameScoreAction.id = result.id;
      gameScoreAction.occurredAt = new Date(result.occurred_at);
      gameScoreAction.occurredByUser = result.user_id
        ? { id: result.user_id }
        : undefined;
      gameScoreAction.occurredToTeam = result.team_id
        ? { id: result.team_id, name: result.team_name || '', members: [] }
        : ({} as any);
      gameScoreAction.value = result.value || 0;

      // Extract key from details JSONB field if it exists
      const details = result.details as any;
      gameScoreAction.key = details?.key || undefined;

      return {
        node: gameScoreAction,
        cursor: CursorUtil.createCursor(
          result.id,
          new Date(result.occurred_at),
        ),
      };
    });

    const totalCount = await client
      .selectFrom('game_actions')
      .select([(eb) => eb.fn.countAll().as('count')])
      .where('game_id', '=', gameId)
      .where('type', '=', 'SCORE')
      .executeTakeFirst();

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      edges,
      pageInfo,
      totalCount: Number(totalCount?.count ?? 0),
    };
  }

  async removeGameAction(id: string): Promise<RemoveGameActionPayload> {
    const { client } = this.databaseService;

    // Get the game ID, team ID, and action type before deletion
    const gameData = await client
      .selectFrom('game_actions')
      .select(['game_id', 'occurred_to_team_id', 'type'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!gameData) {
      throw new Error('Game action not found');
    }

    await client.deleteFrom('game_actions').where('id', '=', id).execute();

    // Recalculate the team's score if this was a SCORE action
    if (gameData.type === 'SCORE' && gameData.occurred_to_team_id) {
      await this.recalculateTeamScore(
        gameData.game_id,
        gameData.occurred_to_team_id,
      );
    }

    return { gameId: gameData.game_id, success: true };
  }
}

import { Injectable } from '@nestjs/common';

import { CursorUtil } from '../../common/pagination/cursor.util';
import { PageInfo } from '../../common/pagination/page-info.model';
import { DatabaseService } from '../../database/database.service';
import { GameActionEdge } from './models/game-action-edge.model';
import { GameActionsConnection } from './models/game-actions-connection.model';

@Injectable()
export class ActionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getGameActions(
    gameId: string,
    first: number,
    after?: string,
  ): Promise<GameActionsConnection> {
    const { client } = this.databaseService;

    let query = client
      .selectFrom('game_actions')
      .leftJoin('team_members', 'team_members.id', 'game_actions.occurred_by')
      .leftJoin('teams', 'teams.id', 'team_members.team_id')
      .select([
        'game_actions.id',
        'game_actions.occurred_at',
        'game_actions.point_value as value',
        'game_actions.type as key',
        'team_members.user_id',
        'teams.id as team_id',
        'teams.name as team_name',
      ])
      .where('game_actions.game_id', '=', gameId)
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

    const edges: GameActionEdge[] = nodes.map((result) => ({
      node: {
        id: result.id,
        occurredAt: new Date(result.occurred_at),
        occurredBy: { id: result.user_id || '' },
        team: result.team_id
          ? { id: result.team_id, name: result.team_name || '', members: [] }
          : ({} as any),
        value: result.value || 0,
        key: result.key || '',
      },
      cursor: CursorUtil.createCursor(result.id, new Date(result.occurred_at)),
    }));

    const totalCount = await client
      .selectFrom('game_actions')
      .select([(eb) => eb.fn.countAll().as('count')])
      .where('game_id', '=', gameId)
      .executeTakeFirst();

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      nodes: edges.map((edge) => edge.node),
      edges,
      pageInfo,
      totalCount: Number(totalCount?.count ?? 0),
    };
  }

  async removeGameAction(
    id: string,
  ): Promise<{ gameId: string; success: boolean }> {
    const { client } = this.databaseService;

    // Get the game ID before deletion
    const gameData = await client
      .selectFrom('game_actions')
      .select(['game_id'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!gameData) {
      throw new Error('Game action not found');
    }

    await client.deleteFrom('game_actions').where('id', '=', id).execute();

    return { gameId: gameData.game_id, success: true };
  }
}

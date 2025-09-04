import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

import { Sport } from '../../../common/enums/sport.enum';
import { DatabaseService } from '../../../database/database.service';
import { TeamsService } from '../../../teams/teams.service';
import { GameStatus } from '../../enums/game-status.enum';
import { Game } from '../../models/game.model';
import { AddGameScorePayload } from './dto/add-game-score.payload';
import { GameScoreInput } from './dto/game-score.input';
import { RemoveGameActionPayload } from './dto/remove-game-action.payload';
import { UpdateGameScorePayload } from './dto/update-game-score.payload';
import { GameScoreAction } from './models/game-score-action.model';

@Injectable()
export class ScoreActionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly teamsService: TeamsService,
  ) {}

  async addGameScore(
    gameId: string,
    input: GameScoreInput,
  ): Promise<AddGameScorePayload> {
    const { client } = this.databaseService;

    const actionResult = await client
      .insertInto('game_actions')
      .values({
        game_id: gameId,
        occurred_by: input.occurredByTeamMemberId,
        point_value: input.value,
        type: 'SCORE',
        occurred_at: new Date().toISOString(),
        details: {
          key: input.key,
        },
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    const action = await this.findGameScoreActionById(actionResult.id);

    if (!action) {
      throw new Error('Failed to add game score');
    }

    // Return minimal game object - let field resolver handle the rest
    const game = {
      id: gameId,
      location: {} as any,
      sport: null as any,
      teams: [] as any,
      status: null as any,
      scheduledAt: undefined,
      startedAt: undefined,
      endedAt: undefined,
      actions: {} as any,
    };

    return { game, action };
  }

  async updateGameScore(
    id: string,
    input: GameScoreInput,
  ): Promise<UpdateGameScorePayload> {
    const { client } = this.databaseService;

    const existingAction = await this.findGameScoreActionById(id);
    if (!existingAction) {
      throw new Error('Game action not found');
    }

    await client
      .updateTable('game_actions')
      .set({
        occurred_by: input.occurredByTeamMemberId,
        point_value: input.value,
        details: {
          key: input.key,
        },
      })
      .where('id', '=', id)
      .execute();

    const action = await this.findGameScoreActionById(id);

    if (!action) {
      throw new Error('Failed to update game score');
    }

    return { action };
  }

  async removeGameAction(id: string): Promise<RemoveGameActionPayload> {
    const { client } = this.databaseService;

    const existingAction = await this.findGameScoreActionById(id);
    if (!existingAction) {
      throw new Error('Game action not found');
    }

    // Get the game ID before deletion
    const gameData = await client
      .selectFrom('game_actions')
      .select(['game_id'])
      .where('id', '=', id)
      .executeTakeFirst();

    await client.deleteFrom('game_actions').where('id', '=', id).execute();

    return { gameId: gameData?.game_id || '', success: true };
  }

  async findGameScoreActionById(id: string): Promise<GameScoreAction | null> {
    const { client } = this.databaseService;

    const result = await client
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
      .where('game_actions.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    const gameScoreAction = new GameScoreAction();
    gameScoreAction.id = result.id;
    gameScoreAction.occurredAt = new Date(result.occurred_at);
    gameScoreAction.occurredBy = { id: result.user_id || '' };
    gameScoreAction.team = result.team_id
      ? { id: result.team_id, name: result.team_name || '', members: [] }
      : ({} as any);
    gameScoreAction.value = result.value || 0;
    gameScoreAction.key = result.key || '';

    return gameScoreAction;
  }

  async findGameById(id: string): Promise<Game | null> {
    const { client } = this.databaseService;

    const gameResult = await client
      .selectFrom('games')
      .leftJoin('locations', 'locations.id', 'games.location_id')
      .select([
        'games.id',
        'games.sport',
        'games.game_state as status',
        'games.scheduled_at',
        'locations.id as location_id',
        'locations.name as location_name',
        sql<number>`gis.st_x(locations.geo::gis.geometry)`.as(
          'location_longitude',
        ),
        sql<number>`gis.st_y(locations.geo::gis.geometry)`.as(
          'location_latitude',
        ),
      ])
      .where('games.id', '=', id)
      .executeTakeFirst();

    if (!gameResult) {
      return null;
    }

    const teams = await this.teamsService.getGameTeams(id);

    return {
      id: gameResult.id,
      location: gameResult.location_id
        ? {
            id: gameResult.location_id,
            name: gameResult.location_name || 'Unknown Location',
            geo: {
              latitude: gameResult.location_latitude || 0,
              longitude: gameResult.location_longitude || 0,
            },
            sports: [],
          }
        : ({} as any),
      sport: gameResult.sport as Sport,
      teams,
      status: gameResult.status as GameStatus,
      scheduledAt: gameResult.scheduled_at
        ? new Date(gameResult.scheduled_at)
        : undefined,
      startedAt: undefined, // Will be populated from game actions
      endedAt: undefined, // Will be populated from game actions
      actions: {} as any, // Resolved via field resolver
    };
  }
}

import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

import { Sport } from '../../../common/enums/sport.enum';
import { DatabaseService } from '../../../database/database.service';
import { TeamsService } from '../../../teams/teams.service';
import { GameStatus } from '../../enums/game-status.enum';
import { Game } from '../../models/game.model';
import { AddGameScorePayload } from './dto/add-game-score.payload';
import { GameScoreInput } from './dto/game-score.input';
import { UpdateGameScorePayload } from './dto/update-game-score.payload';
import { GameScoreAction } from './models/game-score-action.model';

@Injectable()
export class ScoreActionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly teamsService: TeamsService,
  ) {}

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

  async addGameScore(
    gameId: string,
    input: GameScoreInput,
  ): Promise<AddGameScorePayload> {
    const { client } = this.databaseService;

    const actionResult = await client
      .insertInto('game_actions')
      .values({
        game_id: gameId,
        occurred_by_user_id: input.occurredByUserId || null,
        occurred_to_team_id: input.occurredToTeamId,
        point_value: input.value,
        type: 'SCORE',
        occurred_at: new Date().toISOString(),
        details: input.key ? { key: input.key } : null,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    const action = await this.findGameScoreActionById(actionResult.id);

    if (!action) {
      throw new Error('Failed to add game score');
    }

    // Recalculate the team's score after adding the new score action
    await this.recalculateTeamScore(gameId, input.occurredToTeamId);

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

    // Get the current game_id and team_id before update
    const currentActionData = await client
      .selectFrom('game_actions')
      .select(['game_id', 'occurred_to_team_id'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!currentActionData) {
      throw new Error('Game action data not found');
    }

    const oldTeamId = currentActionData.occurred_to_team_id;
    const gameId = currentActionData.game_id;

    await client
      .updateTable('game_actions')
      .set({
        occurred_by_user_id: input.occurredByUserId || null,
        occurred_to_team_id: input.occurredToTeamId,
        point_value: input.value,
        details: input.key ? { key: input.key } : null,
      })
      .where('id', '=', id)
      .execute();

    const action = await this.findGameScoreActionById(id);

    if (!action) {
      throw new Error('Failed to update game score');
    }

    // Recalculate scores for affected teams
    if (oldTeamId && oldTeamId !== input.occurredToTeamId) {
      // If team changed, recalculate both old and new team scores
      await this.recalculateTeamScore(gameId, oldTeamId);
      await this.recalculateTeamScore(gameId, input.occurredToTeamId);
    } else if (input.occurredToTeamId) {
      // If same team or no old team, just recalculate the current team
      await this.recalculateTeamScore(gameId, input.occurredToTeamId);
    }

    return { action };
  }

  async findGameScoreActionById(id: string): Promise<GameScoreAction | null> {
    const { client } = this.databaseService;

    const result = await client
      .selectFrom('game_actions')
      .leftJoin('teams', 'teams.id', 'game_actions.occurred_to_team_id')
      .leftJoin('users', 'users.id', 'game_actions.occurred_by_user_id')
      .select([
        'game_actions.id',
        'game_actions.occurred_at',
        'game_actions.point_value as value',
        'game_actions.details',
        'users.id as user_id',
        'users.email as user_email',
        'users.first_name as user_first_name',
        'users.last_name as user_last_name',
        'users.photo as user_photo',
        'users.display_name as user_display_name',
        'users.created_at as user_created_at',
        'users.updated_at as user_updated_at',
        'users.auth_id as user_auth_id',
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
    gameScoreAction.occurredByUser = result.user_id
      ? {
          id: result.user_id,
          email: result.user_email,
          firstName: result.user_first_name,
          lastName: result.user_last_name,
          photo: result.user_photo ? { source: result.user_photo } : undefined,
          displayName: result.user_display_name,
          createdAt: new Date(result.user_created_at),
          updatedAt: new Date(result.user_updated_at),
          authId: result.user_auth_id,
        }
      : undefined;
    gameScoreAction.occurredToTeam = result.team_id
      ? { id: result.team_id, name: result.team_name || '', members: [] }
      : ({} as any);
    gameScoreAction.value = result.value || 0;

    // Extract key from details JSON if it exists
    const details = result.details as any;
    gameScoreAction.key = details?.key || undefined;

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

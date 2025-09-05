import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

import { Sport } from '../common/enums/sport.enum';
import { DatabaseService } from '../database/database.service';
import { SupabaseService } from '../lib/supabase.service';
import { TeamsService } from '../teams/teams.service';
import { CreateGameInput } from './dto/create-game.input';
import { GameStatus } from './enums/game-status.enum';
import { Game } from './models/game.model';

@Injectable()
export class GamesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly supabaseService: SupabaseService,
    private readonly teamsService: TeamsService,
  ) {}

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
        : null,
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

  async createGame(input: CreateGameInput): Promise<Game> {
    const { client } = this.databaseService;

    const result = await client.transaction().execute(async (trx) => {
      const gameResult = await trx
        .insertInto('games')
        .values({
          sport: input.sport,
          location_id: input.locationId,
          scheduled_at: input.scheduledAt.toISOString(),
          game_state: 'scheduled',
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

      // Add teams to the game
      for (const teamId of input.teamIds) {
        await trx
          .insertInto('game_teams')
          .values({
            game_id: gameResult.id,
            team_id: teamId,
          })
          .execute();
      }

      return gameResult;
    });

    const game = await this.findGameById(result.id);
    if (!game) {
      throw new Error('Failed to create game');
    }

    return game;
  }

  async startGame(gameId: string): Promise<Game> {
    const { client } = this.databaseService;

    await client.transaction().execute(async (trx) => {
      // Check if GAME_END action exists (game has ended)
      const existingEndAction = await trx
        .selectFrom('game_actions')
        .select(['id'])
        .where('game_id', '=', gameId)
        .where('type', '=', 'GAME_END')
        .executeTakeFirst();

      if (existingEndAction) {
        console.log(`Restarting game ${gameId} by removing GAME_END action`);
        // Remove the end action to "restart" the game
        await trx
          .deleteFrom('game_actions')
          .where('id', '=', existingEndAction.id)
          .execute();
      } else {
        // Check if GAME_START action already exists
        const existingStartAction = await trx
          .selectFrom('game_actions')
          .select(['id'])
          .where('game_id', '=', gameId)
          .where('type', '=', 'GAME_START')
          .executeTakeFirst();

        if (!existingStartAction) {
          // Add GAME_START action
          await trx
            .insertInto('game_actions')
            .values({
              game_id: gameId,
              type: 'GAME_START',
              occurred_at: new Date().toISOString(),
            })
            .execute();
        }
      }

      // Update game state
      await trx
        .updateTable('games')
        .set({
          game_state: 'in_progress',
        })
        .where('id', '=', gameId)
        .execute();
    });

    const game = await this.findGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return game;
  }

  async endGame(gameId: string): Promise<Game> {
    const { client } = this.databaseService;

    await client.transaction().execute(async (trx) => {
      // Check if game has been started
      const gameStartAction = await trx
        .selectFrom('game_actions')
        .select(['id'])
        .where('game_id', '=', gameId)
        .where('type', '=', 'GAME_START')
        .executeTakeFirst();

      if (!gameStartAction) {
        throw new Error('Cannot end a game that has not been started');
      }

      // Check if GAME_END action already exists
      const existingEndAction = await trx
        .selectFrom('game_actions')
        .select(['id'])
        .where('game_id', '=', gameId)
        .where('type', '=', 'GAME_END')
        .executeTakeFirst();

      if (!existingEndAction) {
        // Add GAME_END action
        await trx
          .insertInto('game_actions')
          .values({
            game_id: gameId,
            type: 'GAME_END',
            occurred_at: new Date().toISOString(),
          })
          .execute();
      }

      // Update game state
      await trx
        .updateTable('games')
        .set({
          game_state: 'completed',
        })
        .where('id', '=', gameId)
        .execute();
    });

    const game = await this.findGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return game;
  }
}

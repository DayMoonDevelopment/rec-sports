import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

import { DatabaseService } from '../database/database.service';
import { CreateGameInput } from './dto/create-game.input';
import { CreateTeamInput } from './dto/create-team.input';
import { GamesArgs } from './dto/games.args';
import { GamesResponse } from './dto/games-response.dto';
import { GameState } from './enums/game-state.enum';
import { TeamType } from './enums/team-type.enum';
import { Game } from './models/game.model';
import { GameEvent } from './models/game-event.model';
import { Team } from './models/team.model';
import { TeamMember } from './models/team-member.model';

@Injectable()
export class GamesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findGameById(id: string): Promise<Game | null> {
    const { client } = this.databaseService;

    const result = await client
      .selectFrom('games')
      .leftJoin('teams as t1', 't1.id', 'games.team_1_id')
      .leftJoin('teams as t2', 't2.id', 'games.team_2_id')
      .leftJoin('teams as winner', 'winner.id', 'games.winner_team_id')
      .leftJoin('locations', 'locations.id', 'games.location_id')
      .select([
        'games.id',
        'games.sport',
        'games.game_state',
        'games.scheduled_at',
        'games.started_at',
        'games.completed_at',
        'games.team_1_score',
        'games.team_2_score',
        'games.created_at',
        'games.updated_at',
        't1.id as team1_id',
        't1.name as team1_name',
        't1.team_type as team1_type',
        't1.sport_tags as team1_sport_tags',
        't1.created_at as team1_created_at',
        't1.updated_at as team1_updated_at',
        't2.id as team2_id',
        't2.name as team2_name',
        't2.team_type as team2_type',
        't2.sport_tags as team2_sport_tags',
        't2.created_at as team2_created_at',
        't2.updated_at as team2_updated_at',
        'winner.id as winner_id',
        'winner.name as winner_name',
        'winner.team_type as winner_type',
        'winner.sport_tags as winner_sport_tags',
        'winner.created_at as winner_created_at',
        'winner.updated_at as winner_updated_at',
        'locations.id as location_id',
        'locations.name as location_name',
        sql<number>`gis.st_x(locations.geo::gis.geometry)`.as('location_longitude'),
        sql<number>`gis.st_y(locations.geo::gis.geometry)`.as('location_latitude'),
      ])
      .where('games.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return this.transformGameResult(result);
  }

  async findGames(args: GamesArgs): Promise<GamesResponse> {
    const { client } = this.databaseService;
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 20;

    let query = client
      .selectFrom('games')
      .leftJoin('teams as t1', 't1.id', 'games.team_1_id')
      .leftJoin('teams as t2', 't2.id', 'games.team_2_id')
      .leftJoin('teams as winner', 'winner.id', 'games.winner_team_id')
      .leftJoin('locations', 'locations.id', 'games.location_id')
      .select([
        'games.id',
        'games.sport',
        'games.game_state',
        'games.scheduled_at',
        'games.started_at',
        'games.completed_at',
        'games.team_1_score',
        'games.team_2_score',
        'games.created_at',
        'games.updated_at',
        't1.id as team1_id',
        't1.name as team1_name',
        't1.team_type as team1_type',
        't1.sport_tags as team1_sport_tags',
        't1.created_at as team1_created_at',
        't1.updated_at as team1_updated_at',
        't2.id as team2_id',
        't2.name as team2_name',
        't2.team_type as team2_type',
        't2.sport_tags as team2_sport_tags',
        't2.created_at as team2_created_at',
        't2.updated_at as team2_updated_at',
        'winner.id as winner_id',
        'winner.name as winner_name',
        'winner.team_type as winner_type',
        'winner.sport_tags as winner_sport_tags',
        'winner.created_at as winner_created_at',
        'winner.updated_at as winner_updated_at',
        'locations.id as location_id',
        'locations.name as location_name',
        sql<number>`gis.st_x(locations.geo::gis.geometry)`.as('location_longitude'),
        sql<number>`gis.st_y(locations.geo::gis.geometry)`.as('location_latitude'),
      ]);

    // Apply filters
    if (args.sport) {
      query = query.where('games.sport', '=', args.sport);
    }

    if (args.gameState) {
      query = query.where('games.game_state', '=', args.gameState);
    }

    if (args.teamId) {
      query = query.where((eb) =>
        eb.or([
          eb('games.team_1_id', '=', args.teamId),
          eb('games.team_2_id', '=', args.teamId),
        ])
      );
    }

    if (args.locationId) {
      query = query.where('games.location_id', '=', args.locationId);
    }

    if (args.userId) {
      query = query
        .leftJoin('team_members as tm1', 'tm1.team_id', 'games.team_1_id')
        .leftJoin('team_members as tm2', 'tm2.team_id', 'games.team_2_id')
        .where((eb) =>
          eb.or([
            eb('tm1.user_id', '=', args.userId),
            eb('tm2.user_id', '=', args.userId),
          ])
        );
    }

    // Get total count
    const countQuery = query.clearSelect().select((eb) => eb.fn.count('games.id').as('count'));
    const countResult = await countQuery.executeTakeFirst();
    const totalCount = Number(countResult?.count ?? 0);

    // Apply ordering and pagination
    const results = await query
      .orderBy('games.scheduled_at', 'desc')
      .orderBy('games.created_at', 'desc')
      .offset(offset)
      .limit(limit)
      .execute();

    // Transform results
    const nodes = results.map(this.transformGameResult);

    return {
      nodes,
      totalCount,
      hasMore: offset + limit < totalCount,
    };
  }

  async createGame(input: CreateGameInput): Promise<Game> {
    const { client } = this.databaseService;

    const result = await client
      .insertInto('games')
      .values({
        team_1_id: input.team1Id || null,
        team_2_id: input.team2Id || null,
        sport: input.sport,
        scheduled_at: input.scheduledAt?.toISOString() || null,
        location_id: input.locationId || null,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    const game = await this.findGameById(result.id);
    if (!game) {
      throw new Error('Failed to create game');
    }

    return game;
  }

  async createTeam(input: CreateTeamInput): Promise<Team> {
    const { client } = this.databaseService;

    const result = await client
      .insertInto('teams')
      .values({
        name: input.name || null,
        team_type: input.teamType,
        sport_tags: input.sportTags || null,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    const team = await this.findTeamById(result.id);
    if (!team) {
      throw new Error('Failed to create team');
    }

    return team;
  }

  async findTeamById(id: string): Promise<Team | null> {
    const { client } = this.databaseService;

    const result = await client
      .selectFrom('teams')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      name: result.name || undefined,
      teamType: result.team_type as TeamType,
      sportTags: result.sport_tags || undefined,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    };
  }

  async findTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { client } = this.databaseService;

    const results = await client
      .selectFrom('team_members')
      .selectAll()
      .where('team_id', '=', teamId)
      .execute();

    return results.map((result) => ({
      id: result.id,
      teamId: result.team_id,
      userId: result.user_id,
      role: result.role || undefined,
      createdAt: new Date(result.created_at),
    }));
  }

  async findGameEvents(gameId: string): Promise<GameEvent[]> {
    const { client } = this.databaseService;

    const results = await client
      .selectFrom('game_events')
      .leftJoin('teams', 'teams.id', 'game_events.team_id')
      .select([
        'game_events.id',
        'game_events.game_id',
        'game_events.user_id',
        'game_events.event_type',
        'game_events.event_key',
        'game_events.points',
        'game_events.period_number',
        'game_events.period_name',
        'game_events.occurred_at',
        'game_events.created_at',
        'teams.id as team_id',
        'teams.name as team_name',
        'teams.team_type as team_type',
        'teams.sport_tags as team_sport_tags',
        'teams.created_at as team_created_at',
        'teams.updated_at as team_updated_at',
      ])
      .where('game_events.game_id', '=', gameId)
      .orderBy('game_events.occurred_at', 'asc')
      .execute();

    return results.map((result) => ({
      id: result.id,
      gameId: result.game_id,
      team: result.team_id ? {
        id: result.team_id,
        name: result.team_name || undefined,
        teamType: result.team_type as TeamType,
        sportTags: result.team_sport_tags || undefined,
        createdAt: new Date(result.team_created_at),
        updatedAt: new Date(result.team_updated_at),
      } : undefined,
      userId: result.user_id || undefined,
      eventType: result.event_type,
      eventKey: result.event_key || undefined,
      points: result.points,
      periodNumber: result.period_number,
      periodName: result.period_name || undefined,
      occurredAt: new Date(result.occurred_at),
      createdAt: new Date(result.created_at),
    }));
  }

  private transformGameResult(result: any): Game {
    return {
      id: result.id,
      sport: result.sport,
      gameState: result.game_state as GameState,
      scheduledAt: result.scheduled_at ? new Date(result.scheduled_at) : undefined,
      startedAt: result.started_at ? new Date(result.started_at) : undefined,
      completedAt: result.completed_at ? new Date(result.completed_at) : undefined,
      team1Score: result.team_1_score || 0,
      team2Score: result.team_2_score || 0,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
      team1: result.team1_id ? {
        id: result.team1_id,
        name: result.team1_name || undefined,
        teamType: result.team1_type as TeamType,
        sportTags: result.team1_sport_tags || undefined,
        createdAt: new Date(result.team1_created_at),
        updatedAt: new Date(result.team1_updated_at),
      } : undefined,
      team2: result.team2_id ? {
        id: result.team2_id,
        name: result.team2_name || undefined,
        teamType: result.team2_type as TeamType,
        sportTags: result.team2_sport_tags || undefined,
        createdAt: new Date(result.team2_created_at),
        updatedAt: new Date(result.team2_updated_at),
      } : undefined,
      winnerTeam: result.winner_id ? {
        id: result.winner_id,
        name: result.winner_name || undefined,
        teamType: result.winner_type as TeamType,
        sportTags: result.winner_sport_tags || undefined,
        createdAt: new Date(result.winner_created_at),
        updatedAt: new Date(result.winner_updated_at),
      } : undefined,
      location: result.location_id ? {
        id: result.location_id,
        name: result.location_name || 'Unknown Location',
        geo: {
          latitude: result.location_latitude || 0,
          longitude: result.location_longitude || 0,
        },
        sports: [], // Would need additional query to get sports
      } : undefined,
    };
  }
}
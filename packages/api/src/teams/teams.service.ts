import { Injectable } from '@nestjs/common';

import { Sport } from '../common/enums/sport.enum';
import { CursorUtil } from '../common/pagination/cursor.util';
import { PageInfo } from '../common/pagination/page-info.model';
import { DatabaseService } from '../database/database.service';
import { GamesConnection } from '../games/models/game-connection.model';
import { GameEdge } from '../games/models/game-edge.model';
import { GameTeam } from '../games/models/game-team.model';
import { Game } from '../games/models/game.model';
import { AddMemberInput } from './dto/add-member.input';
import { CreateTeamInput } from './dto/create-team.input';
import { RemoveMemberInput } from './dto/remove-member.input';
import { TeamMemberInput } from './dto/team-member.input';
import { TeamEdge } from './models/team-edge.model';
import { Team } from './models/team.model';
import { TeamsConnection } from './models/teams-connection.model';

@Injectable()
export class TeamsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createTeam(input: CreateTeamInput): Promise<Team> {
    const { client } = this.databaseService;

    const result = await client.transaction().execute(async (trx) => {
      const teamResult = await trx
        .insertInto('teams')
        .values({
          name: input.name,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

      // Add team members
      for (const memberId of input.members) {
        await trx
          .insertInto('team_members')
          .values({
            team_id: teamResult.id,
            user_id: memberId,
          })
          .execute();
      }

      return teamResult;
    });

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
      .select(['id', 'name'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    const members = await client
      .selectFrom('team_members')
      .innerJoin('users', 'users.id', 'team_members.user_id')
      .select([
        'users.id',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.photo',
        'users.display_name',
        'users.created_at',
        'users.updated_at',
        'users.auth_id',
      ])
      .where('team_members.team_id', '=', id)
      .execute();

    const sports = await this.getTeamSports(id);
    const games = await this.getTeamGames(id, 20);

    return {
      id: result.id,
      name: result.name || '',
      members: members.map((m) => ({
        id: m.id,
        email: m.email,
        firstName: m.first_name,
        lastName: m.last_name,
        photo: m.photo ? { source: m.photo } : undefined,
        displayName: m.display_name,
        createdAt: new Date(m.created_at),
        updatedAt: new Date(m.updated_at),
        authId: m.auth_id,
      })),
      sports,
      games,
    };
  }

  async addTeamMember(input: TeamMemberInput): Promise<Team> {
    const { client } = this.databaseService;

    await client
      .insertInto('team_members')
      .values({
        team_id: input.teamId,
        user_id: input.userId,
      })
      .execute();

    const team = await this.findTeamById(input.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  async removeTeamMember(input: TeamMemberInput): Promise<Team> {
    const { client } = this.databaseService;

    await client
      .deleteFrom('team_members')
      .where('team_id', '=', input.teamId)
      .where('user_id', '=', input.userId)
      .execute();

    const team = await this.findTeamById(input.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  async addMember(input: AddMemberInput): Promise<Team> {
    const { client } = this.databaseService;

    // Look up user by invite code
    const user = await client
      .selectFrom('users')
      .select(['id'])
      .where('invite_code', '=', input.userInviteCode)
      .executeTakeFirst();

    if (!user) {
      throw new Error('Invalid invite code');
    }

    // Check if user is already a member
    const existingMember = await client
      .selectFrom('team_members')
      .select(['user_id'])
      .where('team_id', '=', input.teamId)
      .where('user_id', '=', user.id)
      .executeTakeFirst();

    if (existingMember) {
      throw new Error('User is already a member of this team');
    }

    // Add the user to the team
    await client
      .insertInto('team_members')
      .values({
        team_id: input.teamId,
        user_id: user.id,
      })
      .execute();

    const team = await this.findTeamById(input.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  async removeMember(input: RemoveMemberInput): Promise<Team> {
    const { client } = this.databaseService;

    // First, check if the current user is a member of the team
    // Note: In a real implementation, you would get the current user from auth context
    // For now, we'll assume the requesting user has permission
    // You can add auth context to get the current user ID and check membership

    // Check if the user to be removed exists in the team
    const existingMember = await client
      .selectFrom('team_members')
      .select(['user_id'])
      .where('team_id', '=', input.teamId)
      .where('user_id', '=', input.userId)
      .executeTakeFirst();

    if (!existingMember) {
      throw new Error('User is not a member of this team');
    }

    // Remove the team member
    await client
      .deleteFrom('team_members')
      .where('team_id', '=', input.teamId)
      .where('user_id', '=', input.userId)
      .execute();

    const team = await this.findTeamById(input.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  async getGameTeams(gameId: string): Promise<GameTeam[]> {
    const { client } = this.databaseService;

    const results = await client
      .selectFrom('game_teams')
      .innerJoin('teams', 'teams.id', 'game_teams.team_id')
      .select([
        'game_teams.game_id',
        'game_teams.team_id',
        'teams.id',
        'teams.name',
        'game_teams.score',
      ])
      .where('game_teams.game_id', '=', gameId)
      .execute();

    const gameTeams: GameTeam[] = [];
    for (const result of results) {
      const team = await this.findTeamById(result.id);
      if (team) {
        gameTeams.push({
          id: `${result.game_id}:${result.team_id}`,
          team,
          score: result.score || 0,
        });
      }
    }

    return gameTeams;
  }

  async getTeamSports(teamId: string): Promise<Sport[]> {
    const { client } = this.databaseService;

    const results = await client
      .selectFrom('game_teams')
      .innerJoin('games', 'games.id', 'game_teams.game_id')
      .select('games.sport')
      .distinct()
      .where('game_teams.team_id', '=', teamId)
      .execute();

    return results.map((result) => result.sport.toUpperCase() as Sport);
  }

  async getTeamGames(
    teamId: string,
    first: number,
    after?: string,
  ): Promise<GamesConnection> {
    const { client } = this.databaseService;

    let query = client
      .selectFrom('game_teams')
      .innerJoin('games', 'games.id', 'game_teams.game_id')
      .leftJoin('locations', 'locations.id', 'games.location_id')
      .select([
        'games.id',
        'games.sport',
        'games.game_state',
        'games.scheduled_at',
        'games.created_at',
        'locations.id as location_id',
        'locations.name as location_name',
        'locations.city',
        'locations.state',
        'locations.country',
        'locations.street',
        'locations.postal_code',
        'locations.lat',
        'locations.lon',
        'locations.sport_tags',
        'locations.bounds',
      ] as const)
      .where('game_teams.team_id', '=', teamId)
      // Sort by game status priority: live first, then upcoming, then finished
      .orderBy((eb) =>
        eb
          .case()
          .when('games.game_state', '=', 'in_progress')
          .then(1)
          .when('games.game_state', '=', 'scheduled')
          .then(2)
          .when('games.game_state', '=', 'finished')
          .then(3)
          .else(4)
          .end(),
      )
      // Then by scheduled_at desc (most recent first within each status)
      .orderBy('games.scheduled_at', 'desc');

    if (after) {
      const { timestamp } = CursorUtil.parseCursor(after);
      if (timestamp) {
        query = query.where(
          'games.scheduled_at',
          '<',
          new Date(timestamp).toISOString(),
        );
      }
    }

    query = query.limit(first + 1);

    const results = await query.execute();
    const hasNextPage = results.length > first;
    const nodes = results.slice(0, first);

    const games: Game[] = nodes.map((result) => ({
      id: result.id,
      sport: result.sport.toUpperCase() as Sport,
      status: result.game_state as any, // GameStatus enum
      scheduledAt: result.scheduled_at
        ? new Date(result.scheduled_at)
        : undefined,
      startedAt: undefined, // Not in database schema
      endedAt: undefined, // Not in database schema
      location: result.location_id
        ? {
            id: result.location_id,
            name: result.location_name || '',
            address: {
              street: result.street || '',
              city: result.city || '',
              stateCode: result.state || '', // Database state column contains the 2-letter code
              postalCode: result.postal_code || '',
              // id and state (full name) will be resolved by AddressResolver
            } as any,
            geo: {
              latitude: result.lat,
              longitude: result.lon,
            },
            sports: result.sport_tags ? (result.sport_tags as Sport[]) : [],
            bounds: (
              result.bounds as {
                geometry: { lat: number; lon: number }[];
              }
            ).geometry.map((g) => ({ latitude: g.lat, longitude: g.lon })),
          }
        : undefined,
      teams: [], // Will be resolved by other resolvers
      actions: {
        nodes: [],
        edges: [],
        pageInfo: { hasNextPage: false, endCursor: null },
        totalCount: 0,
      }, // Will be resolved by other resolvers
    }));

    const edges: GameEdge[] = games.map((game, index) => ({
      node: game,
      cursor: CursorUtil.createCursor(
        game.id,
        nodes[index].scheduled_at
          ? new Date(nodes[index].scheduled_at)
          : new Date(nodes[index].created_at),
      ),
    }));

    const totalCount = await client
      .selectFrom('game_teams')
      .select([(eb) => eb.fn.countAll().as('count')])
      .where('game_teams.team_id', '=', teamId)
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

  async getSuggestedTeams(
    first: number,
    after?: string,
  ): Promise<TeamsConnection> {
    const { client } = this.databaseService;

    // Hardcoded current user ID for testing
    const currentUserId = 'usr_JEqdfwjyhgI2kmsEECMr'; // Replace with actual user ID

    // Query to get teams the user is in or has played against
    // ordered by recency and number of games played
    let query = client
      .with('user_teams', (db) =>
        // Teams the user is a member of
        db
          .selectFrom('team_members')
          .select(['team_id'])
          .where('user_id', '=', currentUserId),
      )
      .with('opponent_teams', (db) =>
        // Teams the user has played AGAINST
        // Find games where user's teams played, then get the opposing teams
        db
          .selectFrom('team_members')
          .innerJoin(
            'game_teams as user_gt',
            'user_gt.team_id',
            'team_members.team_id',
          )
          .innerJoin(
            'game_teams as opponent_gt',
            'opponent_gt.game_id',
            'user_gt.game_id',
          )
          .select(['opponent_gt.team_id'])
          .where('team_members.user_id', '=', currentUserId)
          .where('user_gt.team_id', '!=', (eb) => eb.ref('opponent_gt.team_id'))
          .distinct(),
      )
      .with('all_relevant_teams', (db) =>
        // Union of user's teams and opponent teams
        db
          .selectFrom('user_teams')
          .select(['team_id'])
          .union(db.selectFrom('opponent_teams').select(['team_id'])),
      )
      .with('team_game_stats', (db) =>
        // Calculate stats for each relevant team
        db
          .selectFrom('all_relevant_teams')
          .innerJoin('teams', 'teams.id', 'all_relevant_teams.team_id')
          .leftJoin('game_teams', 'game_teams.team_id', 'teams.id')
          .leftJoin('games', 'games.id', 'game_teams.game_id')
          .select([
            'teams.id',
            'teams.name',
            'teams.created_at',
            (eb) => eb.fn.count('games.id').as('game_count'),
            (eb) => eb.fn.max('games.scheduled_at').as('last_game_date'),
          ])
          .groupBy(['teams.id', 'teams.name', 'teams.created_at']),
      )
      .selectFrom('team_game_stats')
      .select(['id', 'name', 'created_at', 'game_count', 'last_game_date'])
      // Order by recency (most recent games first, fallback to team creation)
      .orderBy((eb) => eb.fn.coalesce('last_game_date', 'created_at'), 'desc')
      // Then by number of games (more games first)
      .orderBy('game_count', 'desc');

    if (after) {
      const { timestamp } = CursorUtil.parseCursor(after);
      if (timestamp) {
        query = query.where(
          (eb) => eb.fn.coalesce('last_game_date', 'created_at'),
          '<',
          new Date(timestamp).toISOString(),
        );
      }
    }

    query = query.limit(first + 1);

    const results = await query.execute();
    const hasNextPage = results.length > first;
    const nodes = results.slice(0, first);

    // Convert results to Team objects
    const teams: Team[] = [];
    for (const result of nodes) {
      const team = await this.findTeamById(result.id);
      if (team) {
        teams.push(team);
      }
    }

    const edges: TeamEdge[] = teams.map((team, index) => ({
      node: team,
      cursor: CursorUtil.createCursor(
        team.id,
        nodes[index].last_game_date
          ? new Date(nodes[index].last_game_date)
          : new Date(nodes[index].created_at),
      ),
    }));

    // Get total count of relevant teams
    const totalCountResult = await client
      .with('user_teams', (db) =>
        db
          .selectFrom('team_members')
          .select(['team_id'])
          .where('user_id', '=', currentUserId),
      )
      .with('opponent_teams', (db) =>
        db
          .selectFrom('team_members')
          .innerJoin(
            'game_teams as user_gt',
            'user_gt.team_id',
            'team_members.team_id',
          )
          .innerJoin(
            'game_teams as opponent_gt',
            'opponent_gt.game_id',
            'user_gt.game_id',
          )
          .select(['opponent_gt.team_id'])
          .where('team_members.user_id', '=', currentUserId)
          .where('user_gt.team_id', '!=', (eb) => eb.ref('opponent_gt.team_id'))
          .distinct(),
      )
      .with('all_relevant_teams', (db) =>
        db
          .selectFrom('user_teams')
          .select(['team_id'])
          .union(db.selectFrom('opponent_teams').select(['team_id'])),
      )
      .selectFrom('all_relevant_teams')
      .select([(eb) => eb.fn.countAll().as('count')])
      .executeTakeFirst();

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      edges,
      pageInfo,
      totalCount: Number(totalCountResult?.count ?? 0),
    };
  }
}

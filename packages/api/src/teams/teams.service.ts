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
import { Team } from './models/team.model';

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
}

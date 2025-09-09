import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { GameTeam } from '../games/models/game-team.model';
import { CreateTeamInput } from './dto/create-team.input';
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
}

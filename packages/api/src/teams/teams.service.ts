import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
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
      .select(['user_id as id'])
      .where('team_members.team_id', '=', id)
      .execute();

    return {
      id: result.id,
      name: result.name || '',
      members: members.map((m) => ({ id: m.id, teams: [], games: [] })),
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

  async getGameTeams(gameId: string): Promise<Team[]> {
    const { client } = this.databaseService;

    const results = await client
      .selectFrom('game_teams')
      .innerJoin('teams', 'teams.id', 'game_teams.team_id')
      .select(['teams.id', 'teams.name'])
      .where('game_teams.game_id', '=', gameId)
      .execute();

    const teams: Team[] = [];
    for (const result of results) {
      const team = await this.findTeamById(result.id);
      if (team) {
        teams.push(team);
      }
    }

    return teams;
  }
}
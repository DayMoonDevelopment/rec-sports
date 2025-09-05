import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql';

import { CreateTeamInput } from './dto/create-team.input';
import { TeamMemberInput } from './dto/team-member.input';
import { CreateTeamPayload } from './dto/create-team.payload';
import { UpdateTeamPayload } from './dto/update-team.payload';
import { TeamsService } from './teams.service';
import { Team } from './models/team.model';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => Team, { nullable: true })
  async team(@Args('id', { type: () => ID }) id: string): Promise<Team | null> {
    return this.teamsService.findTeamById(id);
  }

  @Mutation(() => CreateTeamPayload)
  async createTeam(@Args('input') input: CreateTeamInput): Promise<CreateTeamPayload> {
    const team = await this.teamsService.createTeam(input);
    return { team };
  }

  @Mutation(() => UpdateTeamPayload)
  async addTeamMember(@Args('input') input: TeamMemberInput): Promise<UpdateTeamPayload> {
    const team = await this.teamsService.addTeamMember(input);
    return { team };
  }

  @Mutation(() => UpdateTeamPayload)
  async removeTeamMember(@Args('input') input: TeamMemberInput): Promise<UpdateTeamPayload> {
    const team = await this.teamsService.removeTeamMember(input);
    return { team };
  }
}
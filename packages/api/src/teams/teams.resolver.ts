import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Sport } from '../common/enums/sport.enum';
import { GamesConnection } from '../games/models/game-connection.model';
import { CreateTeamInput } from './dto/create-team.input';
import { CreateTeamPayload } from './dto/create-team.payload';
import { TeamMemberInput } from './dto/team-member.input';
import { UpdateTeamPayload } from './dto/update-team.payload';
import { Team } from './models/team.model';
import { TeamsService } from './teams.service';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => Team, { nullable: true })
  async team(@Args('id', { type: () => ID }) id: string): Promise<Team | null> {
    return this.teamsService.findTeamById(id);
  }

  @Mutation(() => CreateTeamPayload)
  async createTeam(
    @Args('input') input: CreateTeamInput,
  ): Promise<CreateTeamPayload> {
    const team = await this.teamsService.createTeam(input);
    return { team };
  }

  @Mutation(() => UpdateTeamPayload)
  async addTeamMember(
    @Args('input') input: TeamMemberInput,
  ): Promise<UpdateTeamPayload> {
    const team = await this.teamsService.addTeamMember(input);
    return { team };
  }

  @Mutation(() => UpdateTeamPayload)
  async removeTeamMember(
    @Args('input') input: TeamMemberInput,
  ): Promise<UpdateTeamPayload> {
    const team = await this.teamsService.removeTeamMember(input);
    return { team };
  }

  @ResolveField(() => [Sport])
  async sports(@Parent() team: Team): Promise<Sport[]> {
    return this.teamsService.getTeamSports(team.id);
  }

  @ResolveField(() => GamesConnection)
  async games(
    @Parent() team: Team,
    @Args('first', { type: () => Int, defaultValue: 20 }) first: number,
    @Args('after', { nullable: true }) after?: string,
  ): Promise<GamesConnection> {
    return this.teamsService.getTeamGames(team.id, first, after);
  }
}

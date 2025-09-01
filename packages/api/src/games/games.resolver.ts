import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { CreateGameInput } from './dto/create-game.input';
import { CreateGameEventInput } from './dto/create-game-event.input';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateGameEventInput } from './dto/update-game-event.input';
import { GamesArgs } from './dto/games.args';
import { GamesResponse } from './dto/games-response.dto';
import { GamesService } from './games.service';
import { Game } from './models/game.model';
import { GameEvent } from './models/game-event.model';
import { Team } from './models/team.model';
import { TeamMember } from './models/team-member.model';

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => Game, { nullable: true })
  async game(@Args('id') id: string): Promise<Game | null> {
    return this.gamesService.findGameById(id);
  }

  @Query(() => GamesResponse)
  async games(@Args() args: GamesArgs): Promise<GamesResponse> {
    return this.gamesService.findGames(args);
  }

  @Mutation(() => Game)
  async createGame(@Args('input') input: CreateGameInput): Promise<Game> {
    return this.gamesService.createGame(input);
  }

  @ResolveField(() => [GameEvent])
  async events(@Parent() game: Game): Promise<GameEvent[]> {
    return this.gamesService.findGameEvents(game.id);
  }
}

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => Team, { nullable: true })
  async team(@Args('id') id: string): Promise<Team | null> {
    return this.gamesService.findTeamById(id);
  }

  @Mutation(() => Team)
  async createTeam(@Args('input') input: CreateTeamInput): Promise<Team> {
    return this.gamesService.createTeam(input);
  }

  @ResolveField(() => [TeamMember])
  async members(@Parent() team: Team): Promise<TeamMember[]> {
    return this.gamesService.findTeamMembers(team.id);
  }
}

@Resolver(() => GameEvent)
export class GameEventsResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Mutation(() => GameEvent)
  async createGameEvent(@Args('input') input: CreateGameEventInput): Promise<GameEvent> {
    return this.gamesService.createGameEvent(input);
  }

  @Mutation(() => GameEvent)
  async updateGameEvent(@Args('input') input: UpdateGameEventInput): Promise<GameEvent> {
    return this.gamesService.updateGameEvent(input);
  }
}
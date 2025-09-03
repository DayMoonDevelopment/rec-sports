import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from '../models/team.model';

@ObjectType()
export class CreateTeamPayload {
  @Field(() => Team)
  team: Team;
}
import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from '../models/team.model';

@ObjectType()
export class UpdateTeamPayload {
  @Field(() => Team)
  team: Team;
}
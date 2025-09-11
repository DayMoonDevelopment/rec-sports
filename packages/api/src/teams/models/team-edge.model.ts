import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from './team.model';

@ObjectType()
export class TeamEdge {
  @Field(() => Team)
  node: Team;

  @Field()
  cursor: string;
}

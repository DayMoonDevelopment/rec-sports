import { registerEnumType } from '@nestjs/graphql';

export enum TeamType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
}

registerEnumType(TeamType, {
  name: 'TeamType',
  description: 'The type of team - individual player or team',
});
import { registerEnumType } from '@nestjs/graphql';

export enum Sport {
  BASEBALL = 'BASEBALL',
  BASKETBALL = 'BASKETBALL',
  DISC_GOLF = 'DISC_GOLF',
  FOOTBALL = 'FOOTBALL',
  GOLF = 'GOLF',
  HOCKEY = 'HOCKEY',
  KICKBALL = 'KICKBALL',
  PICKLEBALL = 'PICKLEBALL',
  SOCCER = 'SOCCER',
  SOFTBALL = 'SOFTBALL',
  TENNIS = 'TENNIS',
  ULTIMATE = 'ULTIMATE',
  VOLLEYBALL = 'VOLLEYBALL',
}

registerEnumType(Sport, {
  name: 'Sport',
  description: 'Sports available at locations',
});

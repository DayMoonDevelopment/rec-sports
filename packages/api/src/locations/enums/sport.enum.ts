import { registerEnumType } from '@nestjs/graphql';

export enum Sport {
  SOCCER = 'SOCCER',
  BASKETBALL = 'BASKETBALL',
  TENNIS = 'TENNIS',
  BASEBALL = 'BASEBALL',
  FOOTBALL = 'FOOTBALL',
  VOLLEYBALL = 'VOLLEYBALL',
  ULTIMATE = 'ULTIMATE',
  GOLF = 'GOLF',
  DISC_GOLF = 'DISC_GOLF',
  HOCKEY = 'HOCKEY',
  PICKLEBALL = 'PICKLEBALL',
}

registerEnumType(Sport, {
  name: 'Sport',
  description: 'Sports available at locations',
});

import { Field, ObjectType } from '@nestjs/graphql';

import { Session } from './session.model';
import { User } from './user.model';

@ObjectType()
export class UserAuth {
  @Field(() => User)
  user: User;

  @Field(() => Session)
  session: Session;
}
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInGoogleInput } from './dto/sign-in-google.input';
import { UserAuth } from './models/user-auth.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserAuth)
  async signInWithGoogle(@Args('input') input: SignInGoogleInput): Promise<UserAuth> {
    return this.userService.signInWithGoogle(input);
  }
}
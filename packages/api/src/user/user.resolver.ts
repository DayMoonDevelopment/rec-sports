import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInAppleInput } from './dto/sign-in-apple.input';
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

  @Mutation(() => UserAuth)
  async signInWithApple(@Args('input') input: SignInAppleInput): Promise<UserAuth> {
    return this.userService.signInWithApple(input);
  }
}
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInGoogleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @Field()
  @IsString()
  nonce: string;
}

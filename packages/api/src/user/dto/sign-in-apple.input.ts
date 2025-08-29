import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInAppleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  identityToken: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nonce: string;
}
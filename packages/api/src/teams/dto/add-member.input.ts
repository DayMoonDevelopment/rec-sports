import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddMemberInput {
  @Field()
  @IsNotEmpty()
  userInviteCode: string;

  @Field(() => ID)
  @IsNotEmpty()
  teamId: string;
}

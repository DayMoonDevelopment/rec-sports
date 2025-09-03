import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';
import { User } from '../../user/models/user.model';

@ObjectType()
export class Team {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => [User], { nullable: true })
  @IsArray()
  members?: User[];
}
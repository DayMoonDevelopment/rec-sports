import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
export class Address {
  @Field({ nullable: false })
  @IsString()
  id: string;

  @Field({ nullable: false })
  @IsString()
  street: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  street2?: string;

  @Field({ nullable: false })
  @IsString()
  city: string;

  @Field({ nullable: false })
  @IsString()
  state: string;

  @Field({ nullable: false })
  @IsString()
  postalCode: string;

  @Field({ nullable: false })
  @IsString()
  stateCode: string;
}

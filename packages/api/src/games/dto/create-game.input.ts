import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateGameInput {
  @Field({ nullable: true })
  @IsOptional()
  team1Id?: string;

  @Field({ nullable: true })
  @IsOptional()
  team2Id?: string;

  @Field()
  @IsNotEmpty()
  sport: string;

  @Field({ nullable: true })
  @IsOptional()
  scheduledAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  locationId?: string;
}
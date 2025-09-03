import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Sport } from '../../common/enums/sport.enum';

@InputType()
export class CreateGameInput {
  @Field(() => Sport)
  @IsNotEmpty()
  sport: Sport;

  @Field(() => [ID])
  @IsArray()
  @IsNotEmpty()
  teamIds: string[];

  @Field(() => ID)
  @IsNotEmpty()
  locationId: string;

  @Field()
  @IsNotEmpty()
  scheduledAt: Date;
}

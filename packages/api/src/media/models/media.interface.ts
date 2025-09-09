import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class Media {
  @Field()
  source: string;
}

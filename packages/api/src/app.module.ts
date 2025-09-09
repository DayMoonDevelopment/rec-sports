import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { DatabaseModule } from './database/database.module';
import { GamesModule } from './games/games.module';
import { LocationsModule } from './locations/locations.module';
import { MediaModule } from './media/media.module';
import { TeamsModule } from './teams/teams.module';
import { UserModule } from './user/user.module';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  imports: [
    DatabaseModule,
    GamesModule,
    LocationsModule,
    MediaModule,
    TeamsModule,
    UserModule,
    configModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      sortSchema: true,
      debug: true,
      includeStacktraceInErrorResponses: true,
    }),
  ],
})
export class AppModule {}

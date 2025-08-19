import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { Database as SupabaseDatabase } from '@rec/database';
import type { KyselifyDatabase } from 'kysely-supabase';

type Database = KyselifyDatabase<SupabaseDatabase>;

@Injectable({ scope: Scope.REQUEST })
export class DatabaseService {
  private databaseUrl: string;
  client: Kysely<Database>;

  constructor(private readonly configService: ConfigService) {
    this.databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!this.databaseUrl || !this.databaseUrl.trim().length) {
      throw new Error('Missing DATABASE_URL configuration');
    }

    this.client = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });
  }
}

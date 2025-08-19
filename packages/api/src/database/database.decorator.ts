import { createParamDecorator } from '@nestjs/common';

import { DatabaseService } from './database.service';

import type { ExecutionContext } from '@nestjs/common';

export const DatabaseClient = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const databaseService = request.app.get(DatabaseService);

    return databaseService.client;
  },
);

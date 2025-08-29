import { Module } from '@nestjs/common';

import { SupabaseService } from '../lib/supabase.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService, SupabaseService],
  exports: [UserService],
})
export class UserModule {}
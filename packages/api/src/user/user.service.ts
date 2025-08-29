import { Injectable } from '@nestjs/common';
import type { SignInWithIdTokenCredentials } from '@supabase/supabase-js';

import { SupabaseService } from '../lib/supabase.service';
import { SignInAppleInput } from './dto/sign-in-apple.input';
import { SignInGoogleInput } from './dto/sign-in-google.input';
import { UserAuth } from './models/user-auth.model';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signInWithGoogle(input: SignInGoogleInput): Promise<UserAuth> {
    const signInOptions: SignInWithIdTokenCredentials = {
      provider: 'google',
      token: input.idToken,
      nonce: input.nonce,
    };

    const { data, error } =
      await this.supabaseService.client.auth.signInWithIdToken(signInOptions);

    if (error) {
      throw new Error(`Google sign-in failed: ${error.message}`);
    }

    if (!data.user || !data.session) {
      throw new Error('Invalid response from Supabase auth');
    }

    return {
      user: {
        id: data.user.id,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        expiresAt: data.session.expires_at,
        tokenType: data.session.token_type,
      },
    };
  }

  async signInWithApple(input: SignInAppleInput): Promise<UserAuth> {
    const signInOptions: SignInWithIdTokenCredentials = {
      provider: 'apple',
      token: input.identityToken,
      nonce: input.nonce,
    };

    const { data, error } =
      await this.supabaseService.client.auth.signInWithIdToken(signInOptions);

    if (error) {
      throw new Error(`Apple sign-in failed: ${error.message}`);
    }

    if (!data.user || !data.session) {
      throw new Error('Invalid response from Supabase auth');
    }

    return {
      user: {
        id: data.user.id,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        expiresAt: data.session.expires_at,
        tokenType: data.session.token_type,
      },
    };
  }
}

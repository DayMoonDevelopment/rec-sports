import { NativeModule, requireNativeModule } from 'expo';

import { GoogleAuthModuleEvents, GoogleSignInOptions, GoogleSignInResult } from './GoogleAuth.types';

declare class GoogleAuthModule extends NativeModule<GoogleAuthModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  signInAsync(options: GoogleSignInOptions): Promise<GoogleSignInResult>;
  signOutAsync(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<GoogleAuthModule>('GoogleAuth');

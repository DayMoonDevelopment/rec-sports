import { NativeModule, requireNativeModule } from 'expo';

import { GoogleAuthModuleEvents, GoogleSignInResult } from './GoogleAuth.types';

declare class GoogleAuthModule extends NativeModule<GoogleAuthModuleEvents> {
  signInAsync(): Promise<GoogleSignInResult>;
  signOutAsync(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<GoogleAuthModule>('GoogleAuth');

import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './GoogleAuth.types';

type GoogleAuthModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class GoogleAuthModule extends NativeModule<GoogleAuthModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(GoogleAuthModule, 'GoogleAuthModule');

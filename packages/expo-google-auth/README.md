# Google Auth Module

This is a local Expo module that provides Google Sign-In functionality for both iOS and Android platforms, with automatic configuration via an Expo config plugin following Google's official iOS integration guide.

## Setup

### 1. Environment Variables

Add these environment variables to your `.env` files:

```env
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

### 2. App Configuration

Add the Google Auth plugin to your `app.config.ts`:

```typescript
export default ({ config }: ConfigContext): ExpoConfig => {
  const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
  const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID;

  return {
    ...config,
    plugins: [
      // ... other plugins
      [
        "./modules/google-auth/plugin/src/index.ts",
        {
          iosClientId: googleIosClientId,
          webClientId: googleWebClientId,
        },
      ],
    ],
  };
};
```

### 3. Usage

```tsx
import GoogleAuth from './modules/google-auth';

const signIn = async () => {
  try {
    // No parameters needed! Configuration is handled by the config plugin
    const result = await GoogleAuth.signInAsync();
    
    if (result.success) {
      console.log('ID Token:', result.idToken);
      console.log('Nonce:', result.nonce);
    }
  } catch (error) {
    console.error('Sign-in failed:', error);
  }
};

const signOut = async () => {
  try {
    await GoogleAuth.signOutAsync();
  } catch (error) {
    console.error('Sign-out failed:', error);
  }
};
```

## API

### `signInAsync()`

**Parameters:** None (configuration handled by config plugin)

**Returns:**
```typescript
{
  success: boolean;
  idToken?: string;
  nonce?: string;
  error?: string;
}
```

### `signOutAsync()`

Signs out the user from Google.

**Returns:** `Promise<void>`

## Platform Differences

- **Android**: Uses Credential Manager API, reads web client ID from strings.xml
- **iOS**: Uses Google Sign-In SDK, reads client IDs from Info.plist  
- **Configuration**: Both platforms configured automatically by config plugin
- **Response format**: Identical across platforms for maximum compatibility

## Configuration Plugin

The included Expo config plugin (`./plugin/src/index.ts`) automatically:

### iOS Configuration (follows Google's official docs):
1. Sets `GIDClientID` in Info.plist with your iOS client ID
2. Sets `GIDServerClientID` in Info.plist with your web client ID (for backend auth)
3. Generates and adds the reversed client ID URL scheme to `CFBundleURLTypes`
4. Example URL scheme: `com.googleusercontent.apps.123456-abc`

### Android Configuration:
1. Adds `google_web_client_id` to `strings.xml` with your web client ID
2. Native module reads this value at runtime for Credential Manager API

### No Manual Configuration Required
- No need to pass client IDs in JavaScript
- No manual Info.plist editing
- No GoogleService-Info.plist file needed
- Just run `npx expo prebuild` after adding the plugin
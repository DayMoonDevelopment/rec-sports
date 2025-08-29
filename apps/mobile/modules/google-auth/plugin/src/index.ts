import {
  ConfigPlugin,
  createRunOncePlugin,
  withInfoPlist,
} from '@expo/config-plugins';

export interface GoogleAuthPluginProps {
  iosClientId: string;
  webClientId?: string;
}

const withGoogleAuth: ConfigPlugin<GoogleAuthPluginProps> = (config, props) => {
  if (!props?.iosClientId) {
    throw new Error('GoogleAuth plugin requires iosClientId');
  }
  
  return withGoogleAuthIOS(config, props);
};

const withGoogleAuthIOS: ConfigPlugin<GoogleAuthPluginProps> = (config, { iosClientId, webClientId }) => {
  return withInfoPlist(config, (config) => {
    // Set GIDClientID for Google Sign-In iOS SDK
    config.modResults.GIDClientID = iosClientId;
    
    // Set GIDServerClientID if webClientId is provided
    if (webClientId) {
      config.modResults.GIDServerClientID = webClientId;
    }
    
    // Generate reversed client ID for URL scheme
    const reversedClientId = generateReversedClientId(iosClientId);
    
    // Ensure CFBundleURLTypes exists
    if (!config.modResults.CFBundleURLTypes) {
      config.modResults.CFBundleURLTypes = [];
    }
    
    // Check if Google URL scheme already exists
    const existingGoogleScheme = (config.modResults.CFBundleURLTypes as any[]).find((urlType: any) =>
      urlType.CFBundleURLSchemes?.includes(reversedClientId)
    );
    
    if (!existingGoogleScheme) {
      // Add Google Sign-In URL scheme
      (config.modResults.CFBundleURLTypes as any[]).push({
        CFBundleURLSchemes: [reversedClientId],
      });
    }
    
    return config;
  });
};

function generateReversedClientId(clientId: string): string {
  // Convert "123456-abc.apps.googleusercontent.com" to "com.googleusercontent.apps.123456-abc"
  const components = clientId.split('.apps.googleusercontent.com');
  if (components.length > 1) {
    return `com.googleusercontent.apps.${components[0]}`;
  }
  // Fallback if format is unexpected
  return clientId;
}

const pkg = {
  name: '@daymoon/google-auth-plugin',
  version: '1.0.0',
};

export default createRunOncePlugin(withGoogleAuth, pkg.name, pkg.version);
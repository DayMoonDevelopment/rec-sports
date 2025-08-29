import {
  ConfigPlugin,
  createRunOncePlugin,
  withInfoPlist,
  withStringsXml,
} from '@expo/config-plugins';

export interface GoogleAuthPluginProps {
  iosClientId: string;
  webClientId?: string;
}

const withGoogleAuth: ConfigPlugin<GoogleAuthPluginProps> = (config, props) => {
  if (!props?.iosClientId) {
    throw new Error('GoogleAuth plugin requires iosClientId');
  }
  
  // Apply iOS configuration
  config = withGoogleAuthIOS(config, props);
  
  // Apply Android configuration if webClientId is provided
  if (props.webClientId) {
    config = withGoogleAuthAndroid(config, props);
  }
  
  return config;
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

const withGoogleAuthAndroid: ConfigPlugin<GoogleAuthPluginProps> = (config, { webClientId }) => {
  return withStringsXml(config, (config) => {
    // Add web client ID to Android strings.xml
    const stringItems = config.modResults.resources.string || [];
    
    // Check if google_web_client_id already exists
    const existingWebClientId = stringItems.find(
      (item: any) => item.$.name === 'google_web_client_id'
    );
    
    if (!existingWebClientId) {
      stringItems.push({
        $: { name: 'google_web_client_id' },
        _: webClientId,
      });
    } else {
      // Update existing value
      existingWebClientId._ = webClientId;
    }
    
    config.modResults.resources.string = stringItems;
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
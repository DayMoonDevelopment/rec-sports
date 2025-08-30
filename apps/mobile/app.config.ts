import type { ConfigContext, ExpoConfig } from "expo/config";

const iosBundleId = process.env.IOS_BUNDLE_ID;
const androidPackage = process.env.ANDROID_PACKAGE;
const googleMapsAndroidSdkApiKey = process.env.GOOGLE_MAPS_ANDROID_SDK_API_KEY;
const googleIOSClientId = process.env.GOOGLE_IOS_CLIENT_ID;
const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID;
const ASSET_DIR = `./assets/images/${process.env.APP_ENV}`;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "Rec",
    slug: "rec",
    scheme: "rec",
    version: "0.0.1",
    runtimeVersion: "appVersion",
    owner: "daymoondev",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    plugins: [
      ...(config.plugins || []),
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#F9FAFB",
          image: `${ASSET_DIR}/splash-icon-light.png`,
          dark: {
            image: `${ASSET_DIR}/splash-icon-dark.png`,
            backgroundColor: "#111827",
          },
          imageWidth: 200,
        },
      ],
      [
        "@rec/expo-google-auth",
        {
          iosClientId: googleIOSClientId,
          webClientId: googleWebClientId,
        },
      ],
      "expo-apple-authentication",
    ],
    ios: {
      bundleIdentifier: iosBundleId,
      usesAppleSignIn: true,
      icon: {
        dark: `${ASSET_DIR}/ios-dark.png`,
        light: `${ASSET_DIR}/ios-light.png`,
        tinted: `${ASSET_DIR}/ios-tinted.png`,
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: androidPackage,
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: `${ASSET_DIR}/adaptive-icon.png`,
        monochromeImage: `${ASSET_DIR}/adaptive-icon.png`,
        backgroundColor: "#F9FAFB",
      },
      config: {
        googleMaps: {
          apiKey: googleMapsAndroidSdkApiKey,
        },
      },
    },
    extra: {
      eas: {
        projectId: "77f694f2-f533-4eb4-acf5-cc5e3c8e0d99",
      },
    },
    experiments: {
      typedRoutes: true,
    },
  };
};

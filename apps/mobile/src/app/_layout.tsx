import { Platform } from "react-native";
import { useEffect } from "react";
import { Stack } from "expo-router";

import { updateManager } from "~/lib/update-manager";

import { AppProvider } from "~/context/app";
import { ApolloProvider } from "~/context/apollo";
import { PostHogProvider } from "~/context/posthog";

import "~/lib/background-update";
import "~/lib/nativewind";

export const unstable_settings = {
  initialRouteName: "locations",
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize the update manager when the app starts
    updateManager.initialize();

    // Cleanup when the component unmounts
    return () => {
      updateManager.cleanup();
    };
  }, []);

  return (
    <PostHogProvider>
      <AppProvider>
        <ApolloProvider>
          <Stack initialRouteName="locations">
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="locations"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(profile)"
              options={{
                presentation: "modal",
                headerShown: Platform.OS === "android",
              }}
            />
            <Stack.Screen
              name="games/[gameId]"
              options={{
                presentation: "fullScreenModal",
                headerShown: false,
              }}
            />
          </Stack>
        </ApolloProvider>
      </AppProvider>
    </PostHogProvider>
  );
}

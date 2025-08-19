import { Platform } from "react-native";
import { useEffect } from "react";
import { Stack } from "expo-router";

import { updateManager } from "~/lib/update-manager";

import { AppProvider } from "~/context/app";
import { ApolloProvider } from "~/context/apollo";

import "~/lib/background-update";
import "../../global.css";

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
    <AppProvider>
      <ApolloProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="profile"
            options={{
              presentation: "modal",
              headerShown: Platform.OS === "android",
            }}
          />
        </Stack>
      </ApolloProvider>
    </AppProvider>
  );
}

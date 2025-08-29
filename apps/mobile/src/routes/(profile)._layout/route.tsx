import { Stack } from "expo-router";

import { useUserToken } from "~/context/user";

export function Component() {
  const [userToken] = useUserToken();
  const hasUserToken = Boolean(userToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!hasUserToken}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>

      <Stack.Protected guard={hasUserToken}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
    </Stack>
  );
}

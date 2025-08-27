import { View, Text } from "react-native";

import { useUserToken } from "~/context/user";

import { Button, ButtonText } from "~/ui/button";

export function Component() {
  const [token, setToken] = useUserToken();

  function handlePress() {
    setToken(undefined);
  }

  return (
    <View>
      <Button onPress={handlePress}>
        <ButtonText>Log out</ButtonText>
      </Button>
    </View>
  );
}

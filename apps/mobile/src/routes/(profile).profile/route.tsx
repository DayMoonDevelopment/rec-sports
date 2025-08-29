import { View } from "react-native";

import { signOut } from "~/context/user";

import { Button, ButtonText } from "~/ui/button";

export function Component() {
  function handlePress() {
    signOut();
  }

  return (
    <View className="py-safe">
      <Button onPress={handlePress}>
        <ButtonText>Log out</ButtonText>
      </Button>
    </View>
  );
}

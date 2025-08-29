import { Text, View, Image } from "react-native";
import { router } from "expo-router";

import { BackgroundVideo } from "./_background-video";
import { ContinueWithGoogleButton } from "./_continue-with-google-button";
import { ContinueWithAppleButton } from "./_continue-with-apple-button";
import { Button, ButtonIcon } from "~/ui/button";
import { CrossIcon } from "~/icons/cross";

const logoAssetId = require("./assets/rec-icon.png");

export function Component() {
  return (
    <View className="h-full w-full">
      <BackgroundVideo />

      <View className="bg-black/50 h-full w-full flex flex-col py-safe p-4">
        <View className="w-full flex flex-row items-center justify-end">
          <Button variant="secondary" size="icon" onPress={router.back}>
            <ButtonIcon Icon={CrossIcon} />
          </Button>
        </View>

        <View className="flex-1 flex flex-col gap-3 items-center justify-center">
          <Image source={logoAssetId} style={{ objectFit: "contain" }} />
          <Text className="text-5xl font-semibold text-white">
            Join the game.
          </Text>
        </View>

        <View className="flex-1 flex flex-col justify-end gap-4 py-4">
          <ContinueWithAppleButton />
          <ContinueWithGoogleButton />
        </View>
      </View>
    </View>
  );
}

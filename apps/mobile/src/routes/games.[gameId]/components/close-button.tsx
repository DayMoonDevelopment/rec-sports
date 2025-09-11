import { Pressable } from "react-native";
import { router } from "expo-router";
import { CrossIcon } from "~/icons/cross";

export function CloseButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      className="p-2 rounded-full bg-gray-100"
    >
      <CrossIcon className="size-5 text-gray-600" />
    </Pressable>
  );
}
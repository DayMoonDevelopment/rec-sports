import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import type { BottomSheetHandleProps } from "@gorhom/bottom-sheet";

export function BottomSheetHandle({ animatedIndex }: BottomSheetHandleProps) {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1], // From first snap point to second snap point
      [0, 1.0], // From 70% opacity to 100% opacity
    ),
  }));
  //#endregion

  // render
  return (
    <Animated.View
      className="flex flex-row items-center justify-center pt-2"
      style={containerAnimatedStyle}
      collapsable={true}
    >
      <View className="w-[7.5%] h-1 rounded-full bg-muted-foreground" />
    </Animated.View>
  );
}

import React from "react";
import { View, Text } from "react-native";

export function BottomSheetHeader() {
  return (
    <View className="px-4 py-3 border-b border-border">
      <Text className="text-xl font-bold text-foreground">
        Select Teams
      </Text>
      <Text className="text-sm text-muted-foreground mt-1">
        Choose teams for your game
      </Text>
    </View>
  );
}

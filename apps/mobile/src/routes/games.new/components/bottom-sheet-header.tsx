import React from "react";
import { View, Text } from "react-native";

export function BottomSheetHeader() {
  return (
    <View className="px-4 py-3 border-b border-border">
      <Text className="text-xl font-bold text-foreground">Select Teams</Text>
      <Text className="text-sm text-muted-foreground mt-1">
        {`Don't see the team you're looking for? You'll be able to invite them to join after the game is created.`}
      </Text>
    </View>
  );
}

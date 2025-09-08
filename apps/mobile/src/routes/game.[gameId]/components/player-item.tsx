import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "~/lib/utils";

import type { PlayerItemProps } from "../score-context";

export function PlayerItem({
  id,
  teamName,
  selected,
  onPress,
}: PlayerItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={cn(
          "px-4 py-3 rounded-lg border-2 min-w-[80px] items-center justify-center",
          selected
            ? "bg-primary border-primary"
            : "bg-background border-border",
        )}
      >
        <Text
          className={cn(
            "text-sm font-medium text-center",
            selected ? "text-primary-foreground" : "text-foreground",
          )}
          numberOfLines={1}
        >
          {id.slice(-4)}
        </Text>
        <Text
          className={cn(
            "text-xs mt-1 text-center",
            selected ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
          numberOfLines={1}
        >
          {teamName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "~/lib/utils";

import { Button, ButtonText } from "~/ui/button";

import type { PlayerItemProps } from "../score-context";

export function PlayerItem({
  id,
  teamName,
  displayName,
  firstName,
  lastName,
  photoSource,
  selected,
  onPress,
}: PlayerItemProps) {
  // Create display name with fallback logic
  const getDisplayName = () => {
    if (displayName) return displayName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return id.slice(-4); // fallback to last 4 characters of ID
  };

  const playerDisplayName = getDisplayName();

  return (
    <Button
      onPress={onPress}
      variant={selected ? "default" : "outline"}
      className="w-48 justify-start pl-2"
    >
      {/* Profile Image */}
      <View className="">
        {photoSource ? (
          <Image
            source={{ uri: photoSource }}
            className="size-8 rounded-full bg-muted"
            resizeMode="cover"
          />
        ) : (
          <View
            className={cn(
              "size-8 rounded-full items-center justify-center",
              selected ? "bg-primary-foreground/20" : "bg-muted",
            )}
          >
            <Text
              className={cn(
                "text-xs font-semibold",
                selected ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {playerDisplayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Display Name */}
      <ButtonText numberOfLines={1}>{playerDisplayName}</ButtonText>
    </Button>
  );
}

import React from "react";
import { Pressable } from "react-native";

import { PlusSmallIcon } from "~/icons/plus-small";
import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";
import { Sport } from "~/gql/types";

interface ScoreButtonProps {
  sport: Sport;
  onPress: () => void;
  disabled?: boolean;
}

export function ScoreButton({ sport, onPress, disabled }: ScoreButtonProps) {
  return (
    <Pressable
      className="opacity-100 active:opacity-50 transition-opacity"
      onPress={onPress}
      disabled={disabled}
    >
      <Badge variant={sport}>
        <BadgeIcon Icon={PlusSmallIcon} />
        <BadgeText>Score</BadgeText>
      </Badge>
    </Pressable>
  );
}

import React from "react";
import { Pressable } from "react-native";

import { PlusSmallIcon } from "~/icons/plus-small";
import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";
import { Sport } from "~/gql/types";
import { useScoreSheet } from "../score-context";

interface ScoreButtonProps {
  sport: Sport;
  teamId?: string;
  disabled?: boolean;
}

export function ScoreButton({ sport, teamId, disabled }: ScoreButtonProps) {
  const { openScoreSheet } = useScoreSheet();
  return (
    <Pressable
      className="opacity-100 active:opacity-50 transition-opacity"
      onPress={() => openScoreSheet(teamId)}
      disabled={disabled}
    >
      <Badge variant={sport}>
        <BadgeIcon Icon={PlusSmallIcon} />
        <BadgeText>Score</BadgeText>
      </Badge>
    </Pressable>
  );
}

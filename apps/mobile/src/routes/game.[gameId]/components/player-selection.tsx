import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import { useScoreSheet } from "../score-context";
import { PlayerItem } from "./player-item";

export function PlayerSelection() {
  const { players } = useScoreSheet();

  if (players.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      {players.map((player) => (
        <PlayerItem key={player.id} {...player} />
      ))}
    </ScrollView>
  );
}

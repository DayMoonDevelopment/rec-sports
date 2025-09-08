import React from "react";
import { View, Text, ScrollView } from "react-native";

import { useScoreSheet } from "../score-context";
import { PlayerItem } from "./player-item";

export function PlayerSelection() {
  const { players, selectedTeamId } = useScoreSheet();

  if (!selectedTeamId || players.length === 0) {
    return null;
  }

  const selectedTeamPlayers = players.filter(player => player.teamId === selectedTeamId);
  const otherTeamPlayers = players.filter(player => player.teamId !== selectedTeamId);

  return (
    <View className="w-full">
      <Text className="text-sm text-muted-foreground mb-2 text-center">
        Select Player (Optional)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
        className="max-h-24"
      >
        {selectedTeamPlayers.map((player) => (
          <PlayerItem key={player.id} {...player} />
        ))}

        {otherTeamPlayers.length > 0 && selectedTeamPlayers.length > 0 && (
          <View className="w-px h-12 bg-border mx-2 self-center" />
        )}

        {otherTeamPlayers.map((player) => (
          <PlayerItem key={player.id} {...player} />
        ))}
      </ScrollView>
    </View>
  );
}

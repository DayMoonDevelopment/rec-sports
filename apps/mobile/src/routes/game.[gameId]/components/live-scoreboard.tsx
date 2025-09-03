import { View, Text } from "react-native";
import { useState } from "react";

import { useGame } from "../use-game.hook";

import { LoadingState } from "./loading-state";
import { MultiTeamScoreboard } from "./multi-team-scoreboard";
import { TwoTeamScoreboard } from "./two-team-scoreboard";

const TEAM_COLORS = [
  "text-blue-600",
  "text-red-600",
  "text-green-600",
  "text-purple-600",
  "text-orange-600",
  "text-pink-600",
];

export function LiveScoreboard() {
  const { data, loading } = useGame();
  const game = data?.game;
  const [focusedTeamIndex, setFocusedTeamIndex] = useState(0);

  if (loading && !game) {
    return (
      <View className="px-4 py-6 bg-gray-50">
        <View className="flex-row items-center justify-center">
          <LoadingState message="Loading game..." size="large" />
        </View>
      </View>
    );
  }

  if (!game) {
    return (
      <View className="px-4 py-6 bg-gray-50">
        <Text className="text-center text-gray-500">Game not found</Text>
      </View>
    );
  }

  const hasMultipleTeams = game.teams.length >= 3;

  return (
    <View className="px-4 py-6 bg-muted">
      {hasMultipleTeams ? (
        <MultiTeamScoreboard
          focusedTeamIndex={focusedTeamIndex}
          onTeamFocus={setFocusedTeamIndex}
          colors={TEAM_COLORS}
        />
      ) : (
        <TwoTeamScoreboard colors={TEAM_COLORS} />
      )}
    </View>
  );
}

import { View, Text } from "react-native";

import { useGame } from "../use-game.hook";

import { LoadingState } from "./loading-state";
import { MultiTeamScoreboard } from "./multi-team-scoreboard";
import { TwoTeamScoreboard } from "./two-team-scoreboard";

export function LiveScoreboard() {
  const { data, loading, error } = useGame();
  const game = data?.game;

  if (loading) {
    return (
      <View className="px-4 py-6 bg-gray-50">
        <View className="flex-row items-center justify-center">
          <LoadingState message="Loading game..." size="large" />
        </View>
      </View>
    );
  }

  if (error || (!loading && !game)) {
    return (
      <View className="px-4 py-6 bg-gray-50">
        <Text className="text-center text-gray-500">Game not found</Text>
      </View>
    );
  }

  if (!game) return null;

  const hasMultipleTeams = game.teams.length >= 3;

  return (
    <View className="px-4 py-6 bg-muted">
      {hasMultipleTeams ? <MultiTeamScoreboard /> : <TwoTeamScoreboard />}
    </View>
  );
}

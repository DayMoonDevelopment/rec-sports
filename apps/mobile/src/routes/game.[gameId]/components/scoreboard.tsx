import { View, Text } from "react-native";

import { useGame } from "../use-game.hook";

import { LoadingState } from "./loading-state";
import { ScoreboardGrid } from "./scoreboard-grid";
import { ScoreboardColumns } from "./scoreboard-columns";

export function Scoreboard() {
  const { data, loading, error } = useGame();
  const game = data?.game;

  if (loading) {
    return (
      <View className="px-4 py-6 bg-muted">
        <View className="flex-row items-center justify-center">
          <LoadingState message="Loading game..." size="large" />
        </View>
      </View>
    );
  }

  if (error || (!loading && !game)) {
    return (
      <View className="px-4 py-6 bg-muted">
        <Text className="text-center text-muted-foreground">
          Game not found
        </Text>
      </View>
    );
  }

  if (!game) return null;

  const hasMultipleTeams = game.teams.length >= 3;

  return (
    <View className="bg-muted">
      {hasMultipleTeams ? <ScoreboardGrid /> : <ScoreboardColumns />}
    </View>
  );
}

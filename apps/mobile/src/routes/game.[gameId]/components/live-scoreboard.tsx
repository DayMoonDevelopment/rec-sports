import { View, Text } from "react-native";

import { useGame } from "../use-game.hook";

import { GameStateBadge } from "./game-state-badge";
import { TeamScoreCard } from "./team-score-card";
import { GameInfo } from "./game-info";
import { LoadingState } from "./loading-state";

export function LiveScoreboard() {
  const { data, loading } = useGame();
  const game = data?.game;

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

  return (
    <View className="px-4 py-6 bg-gray-50">
      {/* Game State Badge */}
      <GameStateBadge />

      {/* Score Display */}
      <View className="flex-row items-center justify-between mb-4">
        <TeamScoreCard teamIndex={1} scoreColor="text-blue-600" />

        <Text className="text-2xl font-light text-gray-400 mx-4">-</Text>

        <TeamScoreCard teamIndex={2} scoreColor="text-red-600" />
      </View>

      {/* Game Info */}
      <GameInfo />
    </View>
  );
}

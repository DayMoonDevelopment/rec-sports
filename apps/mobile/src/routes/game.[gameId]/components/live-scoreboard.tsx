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
      <View className={`${game.teams.length <= 2 ? 'flex-row items-center justify-between' : 'flex-wrap justify-center'} mb-4`}>
        {game.teams.map((team, index) => {
          const colors = ["text-blue-600", "text-red-600", "text-green-600", "text-purple-600"];
          const scoreColor = colors[index] || "text-gray-600";
          
          return (
            <View key={team.id} className="flex-row items-center">
              <TeamScoreCard 
                teamIndex={(index + 1) as 1 | 2} 
                scoreColor={scoreColor} 
              />
              {index < game.teams.length - 1 && game.teams.length <= 2 && (
                <Text className="text-2xl font-light text-gray-400 mx-4">-</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Game Info */}
      <GameInfo />
    </View>
  );
}

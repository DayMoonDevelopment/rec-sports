import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { GameHeader } from "./_game-header";
import { LiveScoreboard } from "./_live-scoreboard";
import { GameEvents } from "./_game-events";

export function Component() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  return (
    <View className="flex-1 bg-white pt-safe">
      <GameHeader gameId={gameId} />
      <LiveScoreboard gameId={gameId} />
      <GameEvents gameId={gameId} />
    </View>
  );
}

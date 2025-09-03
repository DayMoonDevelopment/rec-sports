import { View } from "react-native";

import { useGame } from "./use-game.hook";

import { GameHeader } from "./components/game-header";
import { LiveScoreboard } from "./components/live-scoreboard";
import { GameEvents } from "./components/game-events";

export function Component() {
  useGame({
    fetchPolicy: "network-only",
    pollInterval: 30_000,
  });

  return (
    <View className="flex-1 bg-white pt-safe">
      <GameHeader />
      <LiveScoreboard />
      <GameEvents />
    </View>
  );
}

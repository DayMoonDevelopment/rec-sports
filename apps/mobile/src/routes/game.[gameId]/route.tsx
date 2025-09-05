import { View } from "react-native";

import { useGame } from "./use-game.hook";

import { GameHeader } from "./components/game-header";
import { LiveScoreboard } from "./components/live-scoreboard";
import { GameActions } from "./components/game-actions";

export function Component() {
  // load the game data into the cache from the network. use cache-first policies for components
  useGame({
    fetchPolicy: "network-only",
    pollInterval: 30_000,
  });

  return (
    <View className="flex-1 bg-background pt-safe">
      <GameHeader />
      <LiveScoreboard />
      <GameActions />
    </View>
  );
}

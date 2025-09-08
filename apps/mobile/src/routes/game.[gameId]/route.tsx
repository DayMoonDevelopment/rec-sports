import { View } from "react-native";

import { useGame } from "./use-game.hook";
import { ScoreProvider } from "./score-context";

import { GameHeader } from "./components/game-header";
import { Scoreboard } from "./components/scoreboard";
import { GameActions } from "./components/game-actions";
import { ScoreBottomSheet } from "./components/score-bottom-sheet";

export function Component() {
  // load the game data into the cache from the network. use cache-first policies for components
  useGame({
    fetchPolicy: "network-only",
    pollInterval: 30_000,
  });

  return (
    <ScoreProvider>
      <View className="flex-1 bg-background pt-safe">
        <GameHeader />
        <Scoreboard />
        <GameActions />

        <ScoreBottomSheet />
      </View>
    </ScoreProvider>
  );
}

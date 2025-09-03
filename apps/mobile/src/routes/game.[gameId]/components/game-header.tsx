import { View } from "react-native";

import { useGame } from "../use-game.hook";

import { GameTitle } from "./game-title";
import { GameMeta } from "./game-meta";
import { CloseButton } from "./close-button";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";

export function GameHeader() {
  const { data, loading } = useGame({
    fetchPolicy: "cache-only",
  });

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
      <View className="flex-1">
        {loading ? (
          <LoadingState />
        ) : data?.game ? (
          <View>
            <GameTitle />
            <GameMeta />
          </View>
        ) : (
          <ErrorState />
        )}
      </View>
      <CloseButton />
    </View>
  );
}

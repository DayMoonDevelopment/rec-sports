import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";

import { GetGameDocument } from "./queries/get-game.generated";

import { GameHeader } from "./components/game-header";
import { LiveScoreboard } from "./components/live-scoreboard";
import { GameEvents } from "./components/game-events";

export function Component() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  useQuery(GetGameDocument, {
    fetchPolicy: "network-only",
    variables: {
      id: gameId,
    },
  });

  return (
    <View className="flex-1 bg-white pt-safe">
      <GameHeader />
      <LiveScoreboard />
      <GameEvents />
    </View>
  );
}

import { View, Text } from "react-native";
import { GameState } from "~/gql/types";

import { useGame } from "../use-game.hook";

export function GameInfo() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  if (!game) return null;

  return (
    <View className="items-center">
      {game.scheduledAt ? (
        <Text className="text-sm text-gray-500 mb-1">
          {game.gameState === GameState.Scheduled ? "Scheduled: " : "Started: "}
          {new Date(game.scheduledAt as string).toLocaleDateString()} at{" "}
          {new Date(game.scheduledAt as string).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ) : null}
      {game.location && (
        <Text className="text-sm text-gray-500">
          {game.location.name}
          {game.location.address &&
            `, ${game.location.address.city}, ${game.location.address.stateCode}`}
        </Text>
      )}
    </View>
  );
}

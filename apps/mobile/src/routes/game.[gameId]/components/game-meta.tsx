import { View, Text } from "react-native";
import { useGame } from "../use-game.hook";

export function GameMeta() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  if (!game) return null;

  return (
    <View className="flex-row items-center">
      <Text className="text-sm text-gray-500 capitalize mr-2">
        {game.status.replace("_", " ")}
      </Text>
      {game.location && (
        <Text className="text-sm text-gray-500">• {game.location.name}</Text>
      )}
    </View>
  );
}

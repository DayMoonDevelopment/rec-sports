import { View, Text } from "react-native";
import { SportIcon } from "~/components/sport-icon";
import { Sport } from "~/gql/types";
import { useGame } from "../use-game.hook";

export function GameTitle() {
  const { data } = useGame();
  const game = data?.game;

  if (!game) return null;

  return (
    <View className="flex-row items-center">
      <SportIcon
        sport={game.sport.toUpperCase() as Sport}
        className="size-6 mr-2"
      />
      <Text className="text-lg font-semibold text-gray-900 capitalize">
        {game.sport} Game
      </Text>
    </View>
  );
}

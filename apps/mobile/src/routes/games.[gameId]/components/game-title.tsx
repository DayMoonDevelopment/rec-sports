import { View, Text } from "react-native";

import { Sport } from "~/gql/types";

import { sportLabel } from "~/lib/utils";

import { SportIcon } from "~/components/sport-icon";

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
      <Text className="text-lg font-semibold text-foreground">
        {sportLabel(game.sport)}
      </Text>
    </View>
  );
}

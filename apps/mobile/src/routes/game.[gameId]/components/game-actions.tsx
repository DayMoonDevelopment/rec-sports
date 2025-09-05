import { View, FlatList } from "react-native";

import { useGame } from "../use-game.hook";

import { GameActionsHeader } from "./game-actions-header";
import { GameScoreActionItem } from "./game-actions-score-item";

import type { GameScoreActionNodeFragment } from "../queries/get-game.generated";
import { Sport } from "~/gql/types";

const renderEvent = ({
  item,
}: {
  item: { sport: Sport; action: GameScoreActionNodeFragment };
}) => <GameScoreActionItem sport={item.sport} action={item.action} />;

export function GameActions() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;
  const actions = game
    ? game.actions?.edges?.map((edge) => ({
        action: edge.node,
        sport: game.sport,
      }))
    : [];

  return (
    <View className="flex-1">
      <GameActionsHeader />

      <FlatList
        data={actions} // Show newest events first
        renderItem={renderEvent}
        keyExtractor={(item) => item.action.id}
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-safe"
      />
    </View>
  );
}

import { View, FlatList } from "react-native";

import { useGame } from "../use-game.hook";

import { GameActionsHeader } from "./game-actions-header";
import { GameEventItem } from "./game-event-item";

const renderEvent = ({ item }: { item: (typeof events)[0] }) => (
  <GameEventItem
    event={{
      ...item,
      occurredAt: String(item.occurredAt),
    }}
  />
);

export function GameEvents() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const events = data?.game?.actions?.edges?.map((edge) => edge.node) || [];

  return (
    <View className="flex-1">
      <GameActionsHeader />

      <FlatList
        data={events.slice().reverse()} // Show newest events first
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-safe"
      />
    </View>
  );
}

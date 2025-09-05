import { View, FlatList } from "react-native";

import { useGame } from "../use-game.hook";

import { EventsHeader } from "./events-header";
import { GameEventItem } from "./game-event-item";

export function GameEvents() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const events = data?.game?.actions?.edges?.map((edge) => edge.node) || [];

  const renderEvent = ({ item }: { item: (typeof events)[0] }) => (
    <GameEventItem
      event={{
        ...item,
        occurredAt: String(item.occurredAt),
      }}
    />
  );

  return (
    <View className="flex-1">
      <EventsHeader />

      <FlatList
        data={events.slice().reverse()} // Show newest events first
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

import { View, Text } from "react-native";

import { useGame } from "../use-game.hook";

export function EventsHeader() {
  const { data } = useGame({
    fetchPolicy: "cache-only",
  });

  const events = data?.game?.actions?.edges?.map((edge) => edge.node) || [];

  return (
    <View className="px-4 py-3 bg-white border-b border-gray-200">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">
          Game Events {events.length > 0 && `(${events.length})`}
        </Text>
        {/* Show realtime status */}
        <View className={`w-2 h-2 rounded-full "bg-green-500"`} />
      </View>
    </View>
  );
}

import { View, Text } from "react-native";
import { useGame } from "../use-game.hook";

interface GameEventItemProps {
  event: {
    __typename?: string;
    id: string;
    key?: string;
    value?: number | null;
    occurredAt: string;
    team?: {
      id: string;
      name?: string | null;
    } | null;
    occurredBy?: {
      id: string;
    } | null;
  };
}

export function GameEventItem({ event }: GameEventItemProps) {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  const formatEventTime = (occurredAt: string) => {
    const date = new Date(occurredAt);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEventType = (key: string | undefined) => {
    if (!key) return "Score";
    // Format the key nicely
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getTeamDisplayName = (
    team: { id: string; name?: string | null } | null | undefined,
  ) => {
    if (!team) return "Unknown Team";
    return team.name || `Team ${team.id.slice(-4)}`;
  };

  return (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="font-medium text-gray-900">
          {formatEventType(event.key)}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600">
            {getTeamDisplayName(event.team)}
          </Text>
        </View>
      </View>
      <View className="items-end">
        {event.value !== null && event.value !== undefined && (
          <Text
            className={`font-semibold ${
              event.value > 0
                ? "text-green-600"
                : event.value < 0
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {event.value > 0 ? "+" : ""}
            {event.value}
          </Text>
        )}
        <Text className="text-xs text-gray-500">
          {formatEventTime(event.occurredAt)}
        </Text>
      </View>
    </View>
  );
}

import { View, Text } from "react-native";
import { useGame } from "../use-game.hook";

interface GameEventItemProps {
  event: {
    id: string;
    eventType: string;
    eventKey?: string | null;
    points: number;
    occurredAt: string;
    team?: {
      id: string;
      name?: string | null;
    } | null;
    periodName?: string | null;
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

  const formatEventType = (eventType: string, eventKey?: string | null) => {
    if (eventKey) {
      return eventKey
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }
    return eventType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getTeamDisplayName = (teamId: string | null) => {
    if (!teamId) return "Unknown Team";

    // Find team from game data
    if (game?.team1?.id === teamId) {
      return game.team1.name || "Team 1";
    }
    if (game?.team2?.id === teamId) {
      return game.team2.name || "Team 2";
    }

    return "Unknown Team";
  };

  return (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="font-medium text-gray-900">
          {formatEventType(event.eventType, event.eventKey)}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600">
            {getTeamDisplayName(event.team?.id || null)}
          </Text>
          {event.periodName && (
            <Text className="text-sm text-gray-500 ml-2">
              • {event.periodName}
            </Text>
          )}
        </View>
      </View>
      <View className="items-end">
        <Text
          className={`font-semibold ${
            event.points > 0
              ? "text-green-600"
              : event.points < 0
                ? "text-red-600"
                : "text-gray-600"
          }`}
        >
          {event.points > 0 ? "+" : ""}
          {event.points}
        </Text>
        <Text className="text-xs text-gray-500">
          {formatEventTime(event.occurredAt)}
        </Text>
      </View>
    </View>
  );
}

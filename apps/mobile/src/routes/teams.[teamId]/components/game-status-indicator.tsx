import { View, Text } from "react-native";
import { format } from "date-fns";
import { GameStatus } from "~/gql/types";

import { useGameClock } from "../../game.[gameId]/use-game-clock.hook";

import { CircleSmallIcon } from "~/icons/circle-small";
import { CheckIcon } from "~/icons/check";

interface GameStatusIndicatorProps {
  status: GameStatus;
  scheduledAt?: unknown | null;
  startedAt?: unknown | null;
  endedAt?: unknown | null;
}

function GameStatusIcon({ status }: { status: GameStatus }) {
  switch (status) {
    case GameStatus.InProgress:
      return (
        <View className="animate-pulse">
          <CircleSmallIcon className="size-3 text-red-500" filled />
        </View>
      );
    case GameStatus.Completed:
      return <CheckIcon className="size-3 text-muted-foreground" />;
    case GameStatus.Upcoming:
    default:
      return null;
  }
}

function GameClock({
  status,
  startedAt,
  endedAt,
}: {
  status: GameStatus;
  startedAt?: unknown | null;
  endedAt?: unknown | null;
}) {
  const { formattedTime } = useGameClock({
    status,
    startedAt: startedAt ? String(startedAt) : null,
    endedAt: endedAt ? String(endedAt) : null,
  });

  return <Text className="text-xs font-semibold">{formattedTime}</Text>;
}

function GameTime({
  status,
  scheduledAt,
  startedAt,
  endedAt,
}: {
  status: GameStatus;
  scheduledAt?: unknown | null;
  startedAt?: unknown | null;
  endedAt?: unknown | null;
}) {
  if (status === GameStatus.Upcoming) {
    if (scheduledAt) {
      const scheduledDate = new Date(String(scheduledAt));
      const relativeTime = format(scheduledDate, "MMM d");

      return (
        <Text className="text-xs font-semibold text-foreground">
          {relativeTime}
        </Text>
      );
    }

    return (
      <Text className="text-xs font-semibold text-foreground">
        Starting soon
      </Text>
    );
  }

  if (status === GameStatus.Completed) {
    const scheduledDate = new Date(String(scheduledAt));
    const relativeTime = format(scheduledDate, "MMM d");

    return (
      <Text className="text-xs text-muted-foreground">{relativeTime}</Text>
    );
  }

  return <GameClock status={status} startedAt={startedAt} endedAt={endedAt} />;
}

export function GameStatusIndicator({
  status,
  scheduledAt,
  startedAt,
  endedAt,
}: GameStatusIndicatorProps) {
  return (
    <View className="flex-row items-center gap-1">
      <GameStatusIcon status={status} />
      <GameTime
        status={status}
        startedAt={startedAt}
        endedAt={endedAt}
        scheduledAt={scheduledAt}
      />
    </View>
  );
}

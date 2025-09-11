import { View, Text } from "react-native";
import { GameStatus } from "~/gql/types";

import { CalendarIcon } from "~/icons/calendar";

import { useGame } from "../use-game.hook";
import { useGameClock } from "../use-game-clock.hook";

export function GameClock() {
  const { data } = useGame({ fetchPolicy: "cache-first" });
  const game = data?.game;

  const gameClock = useGameClock({
    status: game?.status || GameStatus.Upcoming,
    startedAt: game?.startedAt as string,
    endedAt: game?.endedAt as string,
  });

  if (!game) return null;

  if (game.status === GameStatus.InProgress)
    return (
      <Text className="font-mono text-2xl text-muted-foreground text-center self-center">
        {gameClock.formattedTime}
      </Text>
    );

  if (game.status === GameStatus.Upcoming && game.scheduledAt)
    return (
      <View className="flex flex-row items-center gap-1 self-center">
        <CalendarIcon className="text-muted-foreground size-4" />
        <Text className="text-sm text-muted-foreground text-center">
          {new Date(game.scheduledAt as string).toLocaleDateString()} at{" "}
          {new Date(game.scheduledAt as string).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );

  return null;
}

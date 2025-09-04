import { View, Text } from "react-native";
import { GameStatus } from "~/gql/types";

import { CalendarIcon } from "~/icons/calendar";

import { useGame } from "../use-game.hook";
import { TeamScoreCard } from "./team-score-card";
import { GameStatusBadge } from "./game-status-badge";

export function TwoTeamScoreboard() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  if (!game) return null;

  const numberOfTeams = game.teams.length;

  return (
    <View className="flex flex-col gap-6">
      <GameStatusBadge status={game.status} />

      {/* Teams Display */}
      <View className="flex-row items-center justify-center">
        <View className="flex-1">
          <TeamScoreCard teamIndex={1} />
        </View>

        {numberOfTeams === 2 ? (
          <View className="flex-row items-center justify-center">
            <Text className="text-2xl font-light text-muted-foreground text-center">
              -
            </Text>
          </View>
        ) : null}

        {numberOfTeams === 2 ? (
          <View className="flex-1">
            <TeamScoreCard teamIndex={2} />
          </View>
        ) : null}
      </View>

      {/* Game Info */}
      {game.scheduledAt ? (
        <View className="flex flex-row items-center gap-1 self-center">
          {game.status === GameStatus.Upcoming ? (
            <CalendarIcon className="text-muted-foreground size-4" />
          ) : null}
          <Text className="text-sm text-muted-foreground text-center">
            {new Date(game.scheduledAt as string).toLocaleDateString()} at{" "}
            {new Date(game.scheduledAt as string).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

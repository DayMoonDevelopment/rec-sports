import { View, Text } from "react-native";
import { GameStatus } from "~/gql/types";

import { CalendarIcon } from "~/icons/calendar";

import { useGame } from "../use-game.hook";
import { TeamScoreCard } from "./team-score-card";

interface TwoTeamScoreboardProps {
  colors: string[];
}

export function TwoTeamScoreboard({ colors }: TwoTeamScoreboardProps) {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  if (!game) return null;
  const getGameStatusDisplay = () => {
    const isRealtimeConnected = true;

    switch (game.status) {
      case GameStatus.InProgress:
        return {
          text: isRealtimeConnected ? "LIVE" : "LIVE (OFFLINE)",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          dotColor: "bg-green-500",
        };
      case GameStatus.Completed:
        return {
          text: "FINAL",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          dotColor: "bg-gray-400",
        };
      case GameStatus.Upcoming:
        return {
          text: "UPCOMING",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          dotColor: "bg-blue-500",
        };
      default:
        return {
          text: "UNKNOWN",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          dotColor: "bg-gray-400",
        };
    }
  };

  const statusInfo = getGameStatusDisplay();
  const numberOfTeams = game.teams.length;

  return (
    <View className="flex flex-col gap-6">
      {/* Game Status Badge */}
      <View className="flex-row items-center justify-center">
        <View
          className={`flex-row items-center px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}
        >
          <View
            className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dotColor}`}
          />
          <Text className={`text-xs font-medium ${statusInfo.textColor}`}>
            {statusInfo.text}
          </Text>
        </View>
      </View>

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

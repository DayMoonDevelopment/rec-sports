import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useQuery } from "@apollo/client";

import { GetGameDocument } from "./queries/get-game.generated";
import { GameState, TeamType } from "~/gql/types";
import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";
import { PlusSmallIcon } from "~/icons/plus-small";

interface LiveScoreboardProps {
  gameId: string;
}

export function LiveScoreboard({ gameId }: LiveScoreboardProps) {
  const { data, loading } = useQuery(GetGameDocument, {
    variables: { id: gameId },
    pollInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const game = data?.game;

  if (loading && !game) {
    return (
      <View className="px-4 py-6 bg-gray-50">
        <View className="flex-row items-center justify-center">
          <ActivityIndicator size="large" color="#6B7280" />
          <Text className="text-gray-500 ml-3">Loading game...</Text>
        </View>
      </View>
    );
  }

  if (!game) {
    return (
      <View className="px-4 py-6 bg-gray-50">
        <Text className="text-center text-gray-500">Game not found</Text>
      </View>
    );
  }

  const isLive = game.gameState === GameState.InProgress;
  const isCompleted = game.gameState === GameState.Completed;

  const getGameStateDisplay = () => {
    switch (game.gameState) {
      case GameState.InProgress:
        return { text: "LIVE", color: "green" };
      case GameState.Completed:
        return { text: "FINAL", color: "gray" };
      case GameState.Scheduled:
        return { text: "UPCOMING", color: "blue" };
      case GameState.Cancelled:
        return { text: "CANCELLED", color: "red" };
      default:
        return { text: "UNKNOWN", color: "gray" };
    }
  };

  const gameStateDisplay = getGameStateDisplay();

  const getTeamDisplayName = (team: typeof game.team1, fallback: string) => {
    if (!team) return fallback;
    return (
      team.name || (team.teamType === TeamType.Individual ? "Player" : "Team")
    );
  };

  const getWinnerStyles = (teamIndex: 1 | 2) => {
    if (!isCompleted || !game.winnerTeam) return "";
    const isWinner =
      (teamIndex === 1 && game.winnerTeam?.id === game.team1?.id) ||
      (teamIndex === 2 && game.winnerTeam?.id === game.team2?.id);
    return isWinner ? "text-yellow-600" : "text-gray-600";
  };

  return (
    <View className="px-4 py-6 bg-gray-50">
      {/* Game State Badge */}
      <View className="flex-row items-center justify-center mb-4">
        <View
          className={`flex-row items-center px-2 py-1 rounded-full ${
            gameStateDisplay.color === "green"
              ? "bg-green-100"
              : gameStateDisplay.color === "blue"
                ? "bg-blue-100"
                : gameStateDisplay.color === "red"
                  ? "bg-red-100"
                  : "bg-gray-100"
          }`}
        >
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              gameStateDisplay.color === "green"
                ? "bg-green-500"
                : gameStateDisplay.color === "blue"
                  ? "bg-blue-500"
                  : gameStateDisplay.color === "red"
                    ? "bg-red-500"
                    : "bg-gray-400"
            }`}
          />
          <Text
            className={`text-xs font-medium ${
              gameStateDisplay.color === "green"
                ? "text-green-700"
                : gameStateDisplay.color === "blue"
                  ? "text-blue-700"
                  : gameStateDisplay.color === "red"
                    ? "text-red-700"
                    : "text-gray-600"
            }`}
          >
            {gameStateDisplay.text}
          </Text>
        </View>
      </View>

      {/* Score Display */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1 items-center">
          <Text
            className={`text-lg font-medium mb-1 ${getWinnerStyles(1) || "text-gray-900"}`}
          >
            {getTeamDisplayName(game.team1, "Team 1")}
          </Text>
          <Text
            className={`text-4xl font-bold ${getWinnerStyles(1) || "text-blue-600"}`}
          >
            {game.team1Score}
          </Text>

          <Pressable className="opacity-100 active:opacity-50 transition-opacity">
            <Badge variant="outline">
              <BadgeIcon Icon={PlusSmallIcon} />
              <BadgeText>Score</BadgeText>
            </Badge>
          </Pressable>
        </View>

        <Text className="text-2xl font-light text-gray-400 mx-4">{`-`}</Text>

        <View className="flex-1 items-center">
          <Text
            className={`text-lg font-medium mb-1 ${getWinnerStyles(2) || "text-gray-900"}`}
          >
            {getTeamDisplayName(game.team2, "Team 2")}
          </Text>

          <Text
            className={`text-4xl font-bold ${getWinnerStyles(2) || "text-red-600"}`}
          >
            {game.team2Score}
          </Text>

          <Pressable className="opacity-100 active:opacity-50 transition-opacity">
            <Badge variant="outline">
              <BadgeIcon Icon={PlusSmallIcon} />
              <BadgeText>Score</BadgeText>
            </Badge>
          </Pressable>
        </View>
      </View>

      {/* Game Info */}
      <View className="items-center">
        {game.scheduledAt ? (
          <Text className="text-sm text-gray-500 mb-1">
            {game.gameState === GameState.Scheduled
              ? "Scheduled: "
              : "Started: "}
            {new Date(game.scheduledAt as string).toLocaleDateString()} at{" "}
            {new Date(game.scheduledAt as string).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        ) : null}
        {game.location && (
          <Text className="text-sm text-gray-500">
            {game.location.name}
            {game.location.address &&
              `, ${game.location.address.city}, ${game.location.address.stateCode}`}
          </Text>
        )}
      </View>
    </View>
  );
}

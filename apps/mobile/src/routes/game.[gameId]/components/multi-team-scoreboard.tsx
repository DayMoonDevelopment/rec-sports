import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useMutation } from "@apollo/client";

import { CalendarIcon } from "~/icons/calendar";
import { PlusSmallIcon } from "~/icons/plus-small";

import { GameStatus } from "~/gql/types";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

import { useGame } from "../use-game.hook";

import { TeamPreviewCard } from "./team-preview-card";

import { AddGameScoreDocument } from "../mutations/create-game-event.generated";

import type { GameTeamNodeFragment } from "../queries/get-game.generated";

export function MultiTeamScoreboard() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const [focusedTeam, setFocusedTeam] = useState<GameTeamNodeFragment | null>(
    null,
  );
  const [addGameScore, { loading: isAddingScore }] = useMutation(
    AddGameScoreDocument,
    {
      refetchQueries: ["GetGame"],
      awaitRefetchQueries: false,
    },
  );
  const game = data?.game;

  if (!game) return null;
  const getGameStatusDisplay = () => {
    switch (game.status) {
      case GameStatus.InProgress:
        return {
          text: "LIVE",
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
  const isLive = game.status === GameStatus.InProgress;
  const isCompleted = game.status === GameStatus.Completed;

  const getWinnerStyles = (teamScore: number) => {
    if (!isCompleted) return "";
    // For now, we'll determine winner by highest score
    const allTeamScores = game.teams.map((gameTeam) => gameTeam.score || 0);
    const maxScore = Math.max(...allTeamScores);
    const isWinner = teamScore === maxScore && teamScore > 0;
    return isWinner ? "text-yellow-600" : "text-gray-600";
  };

  const handleAddScore = async () => {
    if (!focusedTeam?.team?.id || !game?.id) return;

    try {
      await addGameScore({
        variables: {
          gameId: game.id,
          input: {
            key: "score",
            value: 1,
            occurredByTeamMemberId:
              focusedTeam.team.members?.[0]?.id || "current-user-id", // This should come from auth context
          },
        },
      });
    } catch (error) {
      console.error("Failed to add score:", error);
    }
  };

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

      {/* Focused Team Display */}
      {focusedTeam ? (
        <View className="flex flex-row items-center gap-4">
          <Text className="text-foreground text-5xl font-bold">{`${focusedTeam.score || "12"}`}</Text>
          <Text
            numberOfLines={1}
            className="flex-1 text-foreground text-3xl"
          >{`${focusedTeam.team.name}`}</Text>
        </View>
      ) : null}

      {/* Team Previews Grid */}
      <FlatList
        data={game.teams.filter(
          (team) => team.team.id !== focusedTeam?.team.id,
        )}
        horizontal={false}
        numColumns={3}
        keyExtractor={(gameTeam) => gameTeam.team.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item: gameTeam, index }) => (
          <TeamPreviewCard
            score={gameTeam.score}
            name={gameTeam.team.name}
            onPress={() => setFocusedTeam(gameTeam)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 8 }}
        scrollEnabled={false}
        style={{ flexGrow: 0 }}
      />

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

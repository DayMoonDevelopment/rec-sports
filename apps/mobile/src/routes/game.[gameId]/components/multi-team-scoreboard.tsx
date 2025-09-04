import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";

import { CalendarIcon } from "~/icons/calendar";
import { PlusSmallIcon } from "~/icons/plus-small";

import { GameStatus } from "~/gql/types";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

import { useGame } from "../use-game.hook";
import { useScore } from "../use-score.hook";
import { TeamPreviewCard } from "./team-preview-card";
import { GameStatusBadge } from "./game-status-badge";

import type { GameTeamNodeFragment } from "../queries/get-game.generated";
import { cn } from "~/lib/utils";

export function MultiTeamScoreboard() {
  const [focusedTeam, setFocusedTeam] = useState<GameTeamNodeFragment | null>(
    null,
  );

  const { data } = useGame({
    fetchPolicy: "cache-first",
    onCompleted: (data) => {
      if (!focusedTeam && data?.game?.teams && data.game.teams.length > 0) {
        setFocusedTeam(data.game.teams[0]);
      }
    },
  });
  const { addScore, loading: isAddingScore } = useScore();

  const game = data?.game;

  // Set the first team as focused when component mounts or game data changes
  React.useEffect(() => {
    if (!focusedTeam && game?.teams && game.teams.length > 0) {
      setFocusedTeam(game.teams[0]);
    }
  }, [game?.teams, focusedTeam]);

  if (!game) return null;

  const isLive = game.status === GameStatus.InProgress;
  const teamsList = game.teams.filter(
    (team) => team.team.id !== focusedTeam?.team.id,
  );

  const handleAddScore = async () => {
    if (!focusedTeam?.team?.id) return;

    try {
      await addScore({
        teamId: focusedTeam.team.id,
        value: 1,
      });
    } catch (error) {
      console.error("Failed to add score:", error);
    }
  };

  function Item({ item: gameTeam }: { item: GameTeamNodeFragment }) {
    return (
      <View
        key={gameTeam.team.id}
        className={cn("p-1 flex-1 flex flex-row justify-space-between gap-2")}
        style={{ maxWidth: "33%" }}
      >
        <TeamPreviewCard
          score={gameTeam.score}
          name={gameTeam.team.name}
          onPress={() => setFocusedTeam(gameTeam)}
        />
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-6 py-6">
      <View className="self-center">
        <GameStatusBadge status={game.status} />
      </View>

      {/* Focused Team Display */}
      {focusedTeam ? (
        <View className="flex flex-row items-center gap-4 px-4">
          <Text className="text-foreground text-5xl font-bold">{`${focusedTeam.score}`}</Text>
          <Text
            numberOfLines={1}
            className="flex-1 text-foreground text-3xl"
          >{`${focusedTeam.team.name}`}</Text>
          {isLive ? (
            <Pressable
              className="opacity-100 active:opacity-50 transition-opacity"
              onPress={handleAddScore}
              disabled={isAddingScore}
            >
              <Badge variant="outline">
                <BadgeIcon Icon={PlusSmallIcon} />
                <BadgeText>Score</BadgeText>
              </Badge>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* Team Previews Grid */}
      <View className="max-h-64">
        <FlatList
          data={teamsList}
          horizontal={false}
          numColumns={3}
          keyExtractor={(gameTeam) => gameTeam.team.id}
          renderItem={Item}
          contentContainerClassName="px-3"
          scrollEnabled
          showsVerticalScrollIndicator={false}
        />
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

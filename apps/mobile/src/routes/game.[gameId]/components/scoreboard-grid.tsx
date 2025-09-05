import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";

import { GameStatus } from "~/gql/types";

import { useGame } from "../use-game.hook";
import { useAddScore } from "../use-add-score.hook";

import { GridPreviewCard } from "./scoreboard-grid-preview-card";
import { ScoreButton } from "./score-button";
import { GameClock } from "./scoreboard-game-clock";

import type { GameTeamNodeFragment } from "../queries/get-game.generated";
import { cn } from "~/lib/utils";

export function ScoreboardGrid() {
  const [focusedTeamId, setFocusedTeamId] = useState<string | null>(null);

  const { data } = useGame({
    fetchPolicy: "cache-first",
    onCompleted: (data) => {
      if (!focusedTeamId && data.game?.teams && data.game.teams.length > 0) {
        setFocusedTeamId(data.game.teams[0].team.id);
      }
    },
  });
  const [addScore, { loading: isAddingScore }] = useAddScore();

  const game = data?.game;

  // Derive the focused team from the current game data
  const focusedTeam =
    game?.teams?.find((team) => team.team.id === focusedTeamId) || null;

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
        <GridPreviewCard
          score={gameTeam.score}
          name={gameTeam.team.name}
          onPress={() => setFocusedTeamId(gameTeam.team.id)}
        />
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-6 py-8">
      {/* Focused Team Display */}
      {focusedTeam ? (
        <View className="flex flex-row items-center gap-4 pr-4 pl-6">
          <Text className="text-foreground text-5xl font-bold">{`${focusedTeam.score}`}</Text>

          <Text
            numberOfLines={1}
            className="flex-1 text-foreground text-3xl"
          >{`${focusedTeam.team.name}`}</Text>

          {isLive ? (
            <ScoreButton
              sport={game.sport}
              onPress={handleAddScore}
              disabled={isAddingScore}
            />
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

      <GameClock />
    </View>
  );
}

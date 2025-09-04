import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useMutation } from "@apollo/client";

import { CalendarIcon } from "~/icons/calendar";
import { PlusSmallIcon } from "~/icons/plus-small";

import { GameStatus } from "~/gql/types";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

import { useGame } from "../use-game.hook";
import { TeamPreviewCard } from "./team-preview-card";
import { GameStatusBadge } from "./game-status-badge";
import { AddGameScoreDocument } from "../mutations/create-game-event.generated";

import type { GameTeamNodeFragment } from "../queries/get-game.generated";

function ItemSeparatorComponent() {
  return <View className="size-4" />;
}

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

  const isLive = game.status === GameStatus.InProgress;

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
              focusedTeam.team.members?.[0]?.id || "current-user-id",
          },
        },
      });
    } catch (error) {
      console.error("Failed to add score:", error);
    }
  };

  return (
    <View className="flex flex-col gap-6">
      <GameStatusBadge status={game.status} />

      {/* Focused Team Display */}
      {focusedTeam ? (
        <View className="flex flex-row items-center gap-4">
          <Text className="text-foreground text-5xl font-bold">{`${focusedTeam.score || 0}`}</Text>
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
      <FlatList
        data={game.teams.filter(
          (team) => team.team.id !== focusedTeam?.team.id,
        )}
        horizontal={false}
        numColumns={game.teams.length >= 3 ? 3 : 2}
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
        ItemSeparatorComponent={ItemSeparatorComponent}
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

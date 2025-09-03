import { View, Text, Pressable } from "react-native";
import { useMutation } from "@apollo/client";

import { GameStatus } from "~/gql/types";

import { PlusSmallIcon } from "~/icons/plus-small";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

import { useGame } from "../use-game.hook";

import { AddGameScoreDocument } from "../mutations/create-game-event.generated";

interface TeamScoreCardProps {
  teamIndex: 1 | 2; // Keep for backward compatibility but will be deprecated
  scoreColor: string;
}

export function TeamScoreCard({ teamIndex, scoreColor }: TeamScoreCardProps) {
  const { data } = useGame();
  const [addGameScore, { loading: isAddingScore }] = useMutation(
    AddGameScoreDocument,
    {
      refetchQueries: ["GetGame"],
      awaitRefetchQueries: false,
    },
  );

  const game = data?.game;

  if (!game) return null;

  const gameId = game.id;
  const team = game.teams[teamIndex - 1]; // teamIndex is 1-based, array is 0-based
  const isLive = game.status === GameStatus.InProgress;
  const isCompleted = game.status === GameStatus.Completed;

  // If no team exists for this index, don't render
  if (!team) return null;

  // Calculate team score from game actions
  const teamScore = (game.actions.edges?.map((edge) => edge.node) || [])
    .filter(
      (action: any) =>
        action.__typename === "GameScoreAction" && action.team?.id === team.id,
    )
    .reduce((total: number, action: any) => total + (action.value || 0), 0);

  const getTeamDisplayName = (team: any, fallback: string) => {
    if (!team) return fallback;
    return team.name || fallback;
  };

  const getWinnerStyles = () => {
    if (!isCompleted) return "";
    // For now, we'll determine winner by highest score
    const allTeamScores = game.teams.map((t) => {
      return (game.actions.edges?.map((edge) => edge.node) || [])
        .filter(
          (action: any) =>
            action.__typename === "GameScoreAction" && action.team?.id === t.id,
        )
        .reduce((total: number, action: any) => total + (action.value || 0), 0);
    });
    const maxScore = Math.max(...allTeamScores);
    const isWinner = teamScore === maxScore && teamScore > 0;
    return isWinner ? "text-yellow-600" : "text-gray-600";
  };

  const handleAddScore = async () => {
    if (!team?.id) return;

    try {
      await addGameScore({
        variables: {
          gameId,
          input: {
            key: "score",
            value: 1,
            occurredByTeamMemberId: team.members?.[0]?.id || "current-user-id", // This should come from auth context
          },
        },
      });
    } catch (error) {
      console.error("Failed to add score:", error);
    }
  };

  return (
    <View className="flex-1 items-center">
      <Text
        className={`text-lg font-medium mb-1 ${getWinnerStyles() || "text-gray-900"}`}
      >
        {getTeamDisplayName(team, team?.name || `Team ${teamIndex}`)}
      </Text>
      <Text className={`text-4xl font-bold ${getWinnerStyles() || scoreColor}`}>
        {teamScore}
      </Text>

      <Pressable
        className="opacity-100 active:opacity-50 transition-opacity"
        onPress={handleAddScore}
        disabled={isAddingScore || !isLive}
      >
        <Badge variant="outline">
          <BadgeIcon Icon={PlusSmallIcon} />
          <BadgeText>Score</BadgeText>
        </Badge>
      </Pressable>
    </View>
  );
}

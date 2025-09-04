import { View, Text, Pressable } from "react-native";

import { GameStatus } from "~/gql/types";

import { PlusSmallIcon } from "~/icons/plus-small";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

import { useGame } from "../use-game.hook";
import { useScore } from "../use-score.hook";

interface TeamScoreCardProps {
  teamIndex: 1 | 2; // Keep for backward compatibility but will be deprecated
}

export function TeamScoreCard({ teamIndex }: TeamScoreCardProps) {
  const { data } = useGame({
    fetchPolicy: "cache-first",
  });
  const { addScore, loading: isAddingScore } = useScore();
  const game = data?.game;

  if (!game) return null;

  const gameTeam = game.teams[teamIndex - 1]; // teamIndex is 1-based, array is 0-based
  const isLive = game.status === GameStatus.InProgress;
  const isCompleted = game.status === GameStatus.Completed;

  // If no team exists for this index, don't render
  if (!gameTeam) return null;

  const team = gameTeam.team;
  const teamScore = gameTeam.score;

  const getTeamDisplayName = (team: any, fallback: string) => {
    if (!team) return fallback;
    return team.name || fallback;
  };

  const getWinnerStyles = () => {
    if (!isCompleted) return "";
    // For now, we'll determine winner by highest score
    const allTeamScores = game.teams.map((gameTeam) => gameTeam.score);
    const maxScore = Math.max(...allTeamScores);
    const isWinner = teamScore === maxScore && teamScore > 0;
    return isWinner ? "text-yellow-600" : "text-gray-600";
  };

  const handleAddScore = async () => {
    if (!team?.id) return;

    try {
      await addScore({
        teamId: team.id,
        value: 1,
      });
    } catch (error) {
      console.error("Failed to add score:", error);
    }
  };

  return (
    <View className="flex flex-col items-center">
      <Text
        className={`text-lg font-medium mb-1 ${getWinnerStyles() || "text-gray-900"}`}
      >
        {getTeamDisplayName(team, team?.name || `Team ${teamIndex}`)}
      </Text>

      <Text className={`text-4xl font-bold text-foreground`}>{teamScore}</Text>

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
  );
}

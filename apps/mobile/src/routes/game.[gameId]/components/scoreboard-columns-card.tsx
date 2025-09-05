import { View, Text } from "react-native";

import { GameStatus, Sport } from "~/gql/types";

import { useAddScore } from "../use-add-score.hook";
import { ScoreButton } from "./score-button";

import type { GameTeamNodeFragment } from "../queries/get-game.generated";

interface ColumnsCardProps {
  gameTeam: GameTeamNodeFragment;
  sport: Sport;
  gameStatus: GameStatus;
}

export function ColumnsScoreCard({
  gameTeam,
  sport,
  gameStatus,
}: ColumnsCardProps) {
  const [addScore, { loading: isAddingScore }] = useAddScore();

  const isLive = gameStatus === GameStatus.InProgress;
  const team = gameTeam.team;
  const teamScore = gameTeam.score;

  const getTeamDisplayName = (team: any) => {
    return team?.name || "Team";
  };

  const handleAddScore = async () => {
    if (!gameTeam?.team?.id) return;

    try {
      await addScore({
        teamId: gameTeam.team.id,
        value: 1,
      });
    } catch (error) {
      console.error("Failed to add score:", error);
    }
  };

  return (
    <View className="flex flex-col items-center">
      <Text className={`text-lg font-medium text-foreground`}>
        {getTeamDisplayName(team)}
      </Text>

      <Text className={`text-5xl font-bold text-foreground mt-1 mb-4`}>
        {teamScore}
      </Text>

      {isLive ? (
        <ScoreButton
          sport={sport}
          onPress={handleAddScore}
          disabled={isAddingScore}
        />
      ) : null}
    </View>
  );
}

import { View, Text, Pressable } from "react-native";
import { useMutation } from "@apollo/client";

import { TeamType, GameState } from "~/gql/types";

import { PlusSmallIcon } from "~/icons/plus-small";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

import { useGame } from "../use-game.hook";

import { CreateGameEventDocument } from "../mutations/create-game-event.generated";

interface TeamScoreCardProps {
  teamIndex: 1 | 2;
  scoreColor: string;
}

export function TeamScoreCard({ teamIndex, scoreColor }: TeamScoreCardProps) {
  const { data } = useGame();
  const [createGameEvent, { loading: isAddingScore }] = useMutation(
    CreateGameEventDocument,
    {
      refetchQueries: ["GetGame"],
      awaitRefetchQueries: false,
    },
  );

  const game = data?.game;

  if (!game) return null;

  const gameId = game.id;
  const scores = { team1Score: game.team1Score, team2Score: game.team2Score };
  const team = teamIndex === 1 ? game.team1 : game.team2;
  const score = teamIndex === 1 ? scores.team1Score : scores.team2Score;
  const isLive = game.gameState === GameState.InProgress;
  const isCompleted = game.gameState === GameState.Completed;

  const getTeamDisplayName = (team: typeof game.team1, fallback: string) => {
    if (!team) return fallback;
    return (
      team.name || (team.teamType === TeamType.Individual ? "Player" : "Team")
    );
  };

  const getWinnerStyles = () => {
    if (!isCompleted || !game.winnerTeam) return "";
    const isWinner = game.winnerTeam?.id === team?.id;
    return isWinner ? "text-yellow-600" : "text-gray-600";
  };

  const handleAddScore = async () => {
    if (!team?.id) return;

    try {
      await createGameEvent({
        variables: {
          input: {
            gameId,
            teamId: team.id,
            eventType: "score",
            points: 1,
            description: "Score +1",
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
        {getTeamDisplayName(team, `Team ${teamIndex}`)}
      </Text>
      <Text className={`text-4xl font-bold ${getWinnerStyles() || scoreColor}`}>
        {score}
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

import { View, Text } from "react-native";

import { useGame } from "../use-game.hook";

import { ColumnsScoreCard } from "./scoreboard-columns-card";
import { GameClock } from "./scoreboard-game-clock";

export function ScoreboardColumns() {
  const { data } = useGame({ fetchPolicy: "cache-first" });
  const game = data?.game;

  if (!game) return null;

  const numberOfTeams = game.teams.length;

  return (
    <View className="flex flex-col gap-10 py-12">
      {/* Teams Display */}
      <View className="flex-row items-center justify-center">
        <View className="flex-1">
          <ColumnsScoreCard
            gameTeam={game.teams[0]}
            sport={game.sport}
            gameStatus={game.status}
          />
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
            <ColumnsScoreCard
              gameTeam={game.teams[1]}
              sport={game.sport}
              gameStatus={game.status}
            />
          </View>
        ) : null}
      </View>

      <GameClock />
    </View>
  );
}

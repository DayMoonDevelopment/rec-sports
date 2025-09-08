import { View, Text } from "react-native";

import type { GameScoreActionNodeFragment } from "../queries/get-game.generated";
import { Sport } from "~/gql/types";
import { getSportScoringConfig } from "~/lib/sport-scoring";

function formatTime(occurredAt: string) {
  const date = new Date(occurredAt);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTypeLabel(sport: Sport, actionKey: string | undefined | null) {
  if (!actionKey) {
    return "Score";
  }

  const sportConfig = getSportScoringConfig(sport);
  const scoreType = sportConfig.scoreTypes.find(
    (type) => type.actionKey === actionKey,
  );

  return scoreType?.label || "Score";
}

export function GameScoreActionItem({
  sport,
  action,
}: {
  sport: Sport;
  action: GameScoreActionNodeFragment;
}) {
  console.log(action);
  return (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-border">
      <View className="flex-1">
        <Text className="font-medium text-foreground">
          {action.occurredToTeam.name}
        </Text>
        <Text className="text-sm text-muted-foreground">
          {formatTypeLabel(sport, action.key)}
        </Text>
      </View>

      <View className="items-end">
        <Text className={`text-lg font-semibold text-foreground text-right`}>
          {`${action.value > 0 ? "+" : ""}${action.value}`}
        </Text>
        <Text className="text-sm text-muted-foreground text-right lowercase">
          {formatTime(action.occurredAt as string)}
        </Text>
      </View>
    </View>
  );
}

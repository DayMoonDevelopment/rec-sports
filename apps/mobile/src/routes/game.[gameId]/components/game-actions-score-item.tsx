import { View, Text, Alert } from "react-native";
import ContextMenuView from "react-native-context-menu-view";

import type { GameScoreActionNodeFragment } from "../queries/get-game.generated";
import { Sport } from "~/gql/types";
import { getSportScoringConfig } from "~/lib/sport-scoring";
import { useRemoveGameAction } from "../use-remove-game-action.hook";

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

const CONTEXT_MENU_INDEX_MAP = ["remove_action"];

export function GameScoreActionItem({
  sport,
  action,
}: {
  sport: Sport;
  action: GameScoreActionNodeFragment;
}) {
  const [removeGameAction] = useRemoveGameAction();

  const handleRemoveScore = async () => {
    Alert.alert("Remove Score", "Are you sure you want to remove this score?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeGameAction({
              variables: {
                id: action.id,
              },
            });
          } catch (error) {
            Alert.alert("Error", "Failed to remove score. Please try again.");
            console.error("Failed to remove game action:", error);
          }
        },
      },
    ]);
  };

  return (
    <ContextMenuView
      actions={[
        {
          title: "Remove Score",
          systemIcon: "trash",
          destructive: true,
        },
      ]}
      onPress={(e: any) => {
        switch (CONTEXT_MENU_INDEX_MAP[e.nativeEvent.index]) {
          case "remove_action":
            handleRemoveScore();
            break;
          default:
            console.warn("Unknown action");
            break;
        }
      }}
    >
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
    </ContextMenuView>
  );
}

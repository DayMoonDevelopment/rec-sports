import { View, Text, Alert } from "react-native";
import ContextMenuView from "react-native-context-menu-view";

import { Sport } from "~/gql/types";
import { getSportScoringConfig } from "~/lib/sport-scoring";
import { Avatar, AvatarImage, AvatarFallback } from "~/ui/avatar";

import { useRemoveGameAction } from "../use-remove-game-action.hook";
import { useScoreSheet } from "../score-context";

import type { NativeSyntheticEvent } from "react-native";
import type { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import type { GameScoreActionNodeFragment } from "../queries/get-game.generated";

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

function getUserInitials(user: GameScoreActionNodeFragment["occurredByUser"]) {
  if (!user) return "?";

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const displayName = user.displayName || "";

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (displayName) {
    const parts = displayName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName[0].toUpperCase();
  }

  return "?";
}

const CONTEXT_MENU_INDEX_MAP = ["edit_score", "remove_action"];

export function GameScoreActionItem({
  sport,
  action,
}: {
  sport: Sport;
  action: GameScoreActionNodeFragment;
}) {
  const [removeGameAction] = useRemoveGameAction();
  const { openScoreSheet } = useScoreSheet();

  const handleEditScore = () => {
    // Open the score sheet for editing with the current team, action ID, and user
    openScoreSheet(
      action.occurredToTeam.id,
      action.id,
      action.occurredByUser?.id,
    );
  };

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

  function handlePressContextMenuItem(
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) {
    switch (CONTEXT_MENU_INDEX_MAP[e.nativeEvent.index]) {
      case "edit_score":
        handleEditScore();
        break;
      case "remove_action":
        handleRemoveScore();
        break;
      default:
        console.warn("Unknown action");
        break;
    }
  }

  return (
    <ContextMenuView
      actions={[
        {
          title: "Edit Score",
          systemIcon: "pencil",
        },
        {
          title: "Remove Score",
          systemIcon: "trash",
          destructive: true,
        },
      ]}
      onPress={handlePressContextMenuItem}
    >
      <View className="flex-row items-center justify-between py-3 px-4 border-b border-border">
        {/* User Avatar */}
        <View className="mr-3">
          <Avatar size={32}>
            {action.occurredByUser?.photo?.source && (
              <AvatarImage
                source={{ uri: action.occurredByUser.photo.source }}
              />
            )}
            <AvatarFallback>
              {getUserInitials(action.occurredByUser)}
            </AvatarFallback>
          </Avatar>
        </View>

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

import { View, Text } from "react-native";
import { cva } from "class-variance-authority";

import { GameStatus } from "~/gql/types";

import { CircleSmallIcon } from "~/icons/circle-small";
import { CheckIcon } from "~/icons/check";

import { useGame } from "../use-game.hook";
import { GameActionsHeaderStart } from "./game-actions-header-start";
import { GameActionsHeaderMenu } from "./game-actions-header-menu";

const textStyles = cva("text-lg font-semibold", {
  variants: {
    status: {
      [GameStatus.Upcoming]: "text-muted-foreground font-normal",
      [GameStatus.InProgress]: "text-foreground",
      [GameStatus.Completed]: "text-foreground",
      default: "text-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

function getStatusText(status: GameStatus) {
  switch (status) {
    case GameStatus.InProgress:
      return "Live";
    case GameStatus.Completed:
      return "Final Score";
    case GameStatus.Upcoming:
      return "Ready to play?";
    default:
      return "Ready to start";
  }
}

function renderStatusIcon(status: GameStatus) {
  switch (status) {
    case GameStatus.InProgress:
      return (
        <View className="animate-pulse -ml-1">
          <CircleSmallIcon filled className="size-5 text-red-500" />
        </View>
      );
    case GameStatus.Completed:
      return <CheckIcon className="size-5 text-foreground" />;
    case GameStatus.Upcoming:
      return null;
    default:
      return null;
  }
}

function renderActionButton(gameId: string, status: GameStatus) {
  switch (status) {
    case GameStatus.Upcoming:
      return <GameActionsHeaderStart gameId={gameId} />;

    case GameStatus.InProgress:
    case GameStatus.Completed:
      return <GameActionsHeaderMenu gameId={gameId} status={status} />;

    default:
      return null;
  }
}

export function GameActionsHeader() {
  const { data } = useGame({
    fetchPolicy: "cache-only",
  });

  const game = data?.game;

  if (!game) return null;

  return (
    <View className="px-4 py-3 bg-background border-b border-border">
      <View className="flex-row items-center justify-between gap-1">
        <View className="flex-row items-center gap-1">
          {renderStatusIcon(game.status)}
          <Text className={textStyles({ status: game?.status })}>
            {getStatusText(game.status)}
          </Text>
        </View>

        {renderActionButton(game.id, game.status)}
      </View>
    </View>
  );
}

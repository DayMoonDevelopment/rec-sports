import { View, Text } from "react-native";
import { cva } from "class-variance-authority";
import { GameState } from "~/gql/types";
import { useGame } from "../use-game.hook";

// Badge container styles using GameState as variant key
const badgeVariants = cva("flex-row items-center px-2 py-1 rounded-full", {
  variants: {
    state: {
      [GameState.InProgress]: "bg-green-100",
      [GameState.Completed]: "bg-gray-100",
      [GameState.Scheduled]: "bg-blue-100",
      [GameState.Cancelled]: "bg-red-100",
    },
  },
  defaultVariants: {
    state: GameState.Scheduled,
  },
});

// Dot indicator styles using GameState as variant key
const dotVariants = cva("w-2 h-2 rounded-full mr-2", {
  variants: {
    state: {
      [GameState.InProgress]: "bg-green-500",
      [GameState.Completed]: "bg-gray-400",
      [GameState.Scheduled]: "bg-blue-500",
      [GameState.Cancelled]: "bg-red-500",
    },
  },
  defaultVariants: {
    state: GameState.Scheduled,
  },
});

// Text styles using GameState as variant key
const textVariants = cva("text-xs font-medium", {
  variants: {
    state: {
      [GameState.InProgress]: "text-green-700",
      [GameState.Completed]: "text-gray-600",
      [GameState.Scheduled]: "text-blue-700",
      [GameState.Cancelled]: "text-red-700",
    },
  },
  defaultVariants: {
    state: GameState.Scheduled,
  },
});

// Simple function to get label text
function labelText(gameState: GameState, isConnected: boolean = true) {
  switch (gameState) {
    case GameState.InProgress:
      return isConnected ? "LIVE" : "LIVE (OFFLINE)";
    case GameState.Completed:
      return "FINAL";
    case GameState.Scheduled:
      return "UPCOMING";
    case GameState.Cancelled:
      return "CANCELLED";
    default:
      return "UNKNOWN";
  }
}

export function GameStateBadge() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  if (!game) return null;

  // For now, assume we're connected (we can add realtime connection status later)
  const isRealtimeConnected = true;
  const text = labelText(game.gameState, isRealtimeConnected);

  return (
    <View className="flex-row items-center justify-center mb-4">
      <View className={badgeVariants({ state: game.gameState })}>
        <View className={dotVariants({ state: game.gameState })} />
        <Text className={textVariants({ state: game.gameState })}>{text}</Text>
      </View>
    </View>
  );
}

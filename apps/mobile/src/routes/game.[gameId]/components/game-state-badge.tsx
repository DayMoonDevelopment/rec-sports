import { View, Text } from "react-native";
import { cva } from "class-variance-authority";
import { GameStatus } from "~/gql/types";
import { useGame } from "../use-game.hook";

// Badge container styles using GameStatus as variant key
const badgeVariants = cva("flex-row items-center px-2 py-1 rounded-full", {
  variants: {
    state: {
      [GameStatus.InProgress]: "bg-green-100",
      [GameStatus.Completed]: "bg-gray-100",
      [GameStatus.Upcoming]: "bg-blue-100",
    },
  },
  defaultVariants: {
    state: GameStatus.Upcoming,
  },
});

// Dot indicator styles using GameStatus as variant key
const dotVariants = cva("w-2 h-2 rounded-full mr-2", {
  variants: {
    state: {
      [GameStatus.InProgress]: "bg-green-500",
      [GameStatus.Completed]: "bg-gray-400",
      [GameStatus.Upcoming]: "bg-blue-500",
    },
  },
  defaultVariants: {
    state: GameStatus.Upcoming,
  },
});

// Text styles using GameStatus as variant key
const textVariants = cva("text-xs font-medium", {
  variants: {
    state: {
      [GameStatus.InProgress]: "text-green-700",
      [GameStatus.Completed]: "text-gray-600",
      [GameStatus.Upcoming]: "text-blue-700",
    },
  },
  defaultVariants: {
    state: GameStatus.Upcoming,
  },
});

// Simple function to get label text
function labelText(gameStatus: GameStatus, isConnected: boolean = true) {
  switch (gameStatus) {
    case GameStatus.InProgress:
      return isConnected ? "LIVE" : "LIVE (OFFLINE)";
    case GameStatus.Completed:
      return "FINAL";
    case GameStatus.Upcoming:
      return "UPCOMING";
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
  const text = labelText(game.status, isRealtimeConnected);

  return (
    <View className="flex-row items-center justify-center mb-4">
      <View className={badgeVariants({ state: game.status })}>
        <View className={dotVariants({ state: game.status })} />
        <Text className={textVariants({ state: game.status })}>{text}</Text>
      </View>
    </View>
  );
}

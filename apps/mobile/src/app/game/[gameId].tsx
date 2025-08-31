import { useLocalSearchParams } from "expo-router";
import GameRoute from "~/routes/game.[gameId]/route";

export default function GameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  if (!gameId) {
    throw new Error("Game ID is required");
  }

  return <GameRoute gameId={gameId} />;
}
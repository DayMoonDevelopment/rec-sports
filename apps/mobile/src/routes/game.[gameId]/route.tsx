import { View } from "react-native";
import { GameHeader } from "./_game-header";
import { LiveScoreboard } from "./_live-scoreboard";
import { GameEvents } from "./_game-events";

interface GameRouteProps {
  gameId: string;
}

export default function GameRoute({ gameId }: GameRouteProps) {
  return (
    <View className="flex-1 bg-white">
      <GameHeader gameId={gameId} />
      <LiveScoreboard gameId={gameId} />
      <GameEvents gameId={gameId} />
    </View>
  );
}
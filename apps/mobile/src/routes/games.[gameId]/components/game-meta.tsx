import { Text } from "react-native";
import { useGame } from "../use-game.hook";

export function GameMeta() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  if (!game || !game.location) return null;

  return (
    <Text className="text-sm text-muted-foreground">{game.location.name}</Text>
  );
}

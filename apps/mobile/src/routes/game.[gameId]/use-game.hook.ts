import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import { GetGameDocument } from "./queries/get-game.generated";

export function useGame(args = {}) {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  return useQuery(GetGameDocument, {
    fetchPolicy: "network-only",
    ...args,
    variables: {
      id: gameId,
    },
  });
}

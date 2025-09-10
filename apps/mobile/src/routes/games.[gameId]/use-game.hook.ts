import { QueryHookOptions, useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import {
  GetGameDocument,
  GetGameQuery,
  GetGameQueryVariables,
} from "./queries/get-game.generated";

type UseGameOptions = Omit<
  QueryHookOptions<GetGameQuery, GetGameQueryVariables>,
  "variables"
>;

export function useGame(options: UseGameOptions = {}) {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  return useQuery(GetGameDocument, {
    ...options,
    variables: {
      id: gameId!,
    },
    skip: !gameId,
    errorPolicy: "all",
  });
}

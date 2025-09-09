import { MutationHookOptions, useMutation } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import {
    UpdateGameScoreDocument,
    UpdateGameScoreMutation,
    UpdateGameScoreMutationVariables,
} from "./mutations/update-game-score.generated";
import { GetGameDocument } from "./queries/get-game.generated";

type UseUpdateScoreOptions = Omit<
  MutationHookOptions<UpdateGameScoreMutation, UpdateGameScoreMutationVariables>,
  "mutation"
>;

export function useUpdateScore(options: UseUpdateScoreOptions = {}) {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  return useMutation(UpdateGameScoreDocument, {
    ...options,
    refetchQueries: [
      {
        query: GetGameDocument,
        variables: {
          id: gameId!,
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}

import { MutationHookOptions, useMutation } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import {
  RemoveGameActionDocument,
  RemoveGameActionMutation,
  RemoveGameActionMutationVariables,
} from "./mutations/remove-game-action.generated";
import { GetGameDocument } from "./queries/get-game.generated";

type UseRemoveGameActionOptions = Omit<
  MutationHookOptions<
    RemoveGameActionMutation,
    RemoveGameActionMutationVariables
  >,
  "mutation"
>;

export function useRemoveGameAction(options: UseRemoveGameActionOptions = {}) {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  return useMutation(RemoveGameActionDocument, {
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

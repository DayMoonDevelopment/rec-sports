import { useMutation } from "@apollo/client";
import { router } from "expo-router";

import { CreateGameDocument } from "./mutations/create-game.generated";

import type { CreateGameInput } from "~/gql/types";

export function useCreateGame() {
  const [createGameMutation, { loading, error }] = useMutation(CreateGameDocument);

  const createGame = async (input: CreateGameInput) => {
    try {
      const result = await createGameMutation({
        variables: { input },
      });

      if (result.data?.createGame?.game?.id) {
        // Navigate to the newly created game
        router.replace(`/games/${result.data.createGame.game.id}`);
      }

      return result;
    } catch (err) {
      console.error("Failed to create game:", err);
      throw err;
    }
  };

  return {
    createGame,
    loading,
    error,
  };
}

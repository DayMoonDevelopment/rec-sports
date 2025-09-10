import { useMemo } from "react";
import { useMutation } from "@apollo/client";

import { GameStatus } from "~/gql/types";
import { Button, ButtonText } from "~/ui/button";

import { StartGameDocument } from "../mutations/start-game.generated";

interface GameActionsHeaderStartProps {
  gameId: string;
}

export function GameActionsHeaderStart({
  gameId,
}: GameActionsHeaderStartProps) {
  const mutationOptions = useMemo(
    () => ({
      variables: {
        gameId,
      },
      optimisticResponse: () => ({
        startGame: {
          __typename: "UpdateGamePayload" as const,
          game: {
            __typename: "Game" as const,
            id: gameId,
            status: GameStatus.InProgress,
            startedAt: new Date().toISOString(),
          },
        },
      }),
    }),
    [gameId],
  );

  const [startGame, { loading }] = useMutation(
    StartGameDocument,
    mutationOptions,
  );

  function handlePress() {
    return startGame();
  }

  return (
    <Button onPress={handlePress} disabled={loading}>
      <ButtonText>{loading ? "Starting..." : "Start Game"}</ButtonText>
    </Button>
  );
}

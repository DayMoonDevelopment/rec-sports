import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import ContextMenu from "react-native-context-menu-view";

import { GameStatus } from "~/gql/types";
import { useConfirmation } from "~/hooks/use-confirmation";
import { Button, ButtonIcon } from "~/ui/button";
import { MenuDotsVerticalIcon } from "~/icons/menu-dots-vertical";

import { StartGameDocument } from "../mutations/start-game.generated";
import { EndGameDocument } from "../mutations/end-game.generated";

interface GameActionsHeaderMenuProps {
  gameId: string;
  status: GameStatus;
}

export function GameActionsHeaderMenu({
  gameId,
  status,
}: GameActionsHeaderMenuProps) {
  const { confirm } = useConfirmation();

  const startGameOptions = useMemo(
    () => ({
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
      update: (cache: any, { data: mutationData }: any) => {
        if (mutationData?.startGame?.game) {
          cache.modify({
            id: cache.identify({
              __typename: "Game",
              id: mutationData.startGame.game.id,
            }),
            fields: {
              status: () => mutationData.startGame.game.status,
              startedAt: () => mutationData.startGame.game.startedAt,
            },
          });
        }
      },
    }),
    [gameId],
  );

  const endGameOptions = useMemo(
    () => ({
      optimisticResponse: () => ({
        endGame: {
          __typename: "UpdateGamePayload" as const,
          game: {
            __typename: "Game" as const,
            id: gameId,
            status: GameStatus.Completed,
            endedAt: new Date().toISOString(),
          },
        },
      }),
      update: (cache: any, { data: mutationData }: any) => {
        if (mutationData?.endGame?.game) {
          cache.modify({
            id: cache.identify({
              __typename: "Game",
              id: mutationData.endGame.game.id,
            }),
            fields: {
              status: () => mutationData.endGame.game.status,
              endedAt: () => mutationData.endGame.game.endedAt,
            },
          });
        }
      },
    }),
    [gameId],
  );

  const [startGame] = useMutation(StartGameDocument, startGameOptions);
  const [endGame] = useMutation(EndGameDocument, endGameOptions);

  const handleEndGame = async () => {
    const confirmed = await confirm({
      title: "End Game",
      message:
        "Are you sure you want to end this game?",
      confirmText: "End Game",
      cancelText: "Cancel",
    });

    if (confirmed) {
      endGame({ variables: { gameId } });
    }
  };

  const handleResumeGame = async () => {
    const confirmed = await confirm({
      title: "Resume Game",
      message: "Are you sure you want to resume this completed game?",
      confirmText: "Resume Game",
      cancelText: "Cancel",
    });

    if (confirmed) {
      startGame({ variables: { gameId } });
    }
  };

  if (status === GameStatus.InProgress) {
    return (
      <ContextMenu
        dropdownMenuMode
        actions={[{ title: "End Game", destructive: true }]}
        onPress={(e) => {
          if (e.nativeEvent.index === 0) {
            handleEndGame();
          }
        }}
      >
        <Button variant="ghost" size="icon">
          <ButtonIcon Icon={MenuDotsVerticalIcon} />
        </Button>
      </ContextMenu>
    );
  }

  if (status === GameStatus.Completed) {
    return (
      <ContextMenu
        actions={[{ title: "Resume Game" }]}
        onPress={(e) => {
          if (e.nativeEvent.index === 0) {
            handleResumeGame();
          }
        }}
      >
        <Button variant="ghost" size="icon">
          <ButtonIcon Icon={MenuDotsVerticalIcon} />
        </Button>
      </ContextMenu>
    );
  }

  return null;
}

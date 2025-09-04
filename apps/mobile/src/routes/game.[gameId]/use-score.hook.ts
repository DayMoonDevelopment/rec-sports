import { useMutation } from "@apollo/client";
import { AddGameScoreDocument } from "./mutations/create-game-event.generated";
import { UpdateGameScoreDocument } from "./mutations/update-game-score.generated";
import { useGame } from "./use-game.hook";

/**
 * Hook for managing game scores with cache updates
 *
 * @returns Score management methods and state
 */
export function useScore() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  const [addGameScore, { loading: addLoading }] =
    useMutation(AddGameScoreDocument);

  const addScore = async ({
    teamId,
    value,
    key = null,
  }: {
    teamId: string;
    value: number;
    key?: string | null;
  }) => {
    if (!game?.id) {
      throw new Error("Game not found");
    }

    let tempActionId = `game-score-action-${Date.now()}`;
    const optimisticActionData = {
      __typename: "GameScoreAction" as const,
      id: tempActionId,
      occurredAt: new Date().toISOString(),
      value,
      key,
      occurredByUser: null,
      occurredToTeam: {
        __typename: "Team" as const,
        id: teamId,
        name: "", // We don't have the team name in this context
      },
    };

    const optimisticGameData = {
      ...game,
      teams: game.teams.map((team) =>
        team.id === teamId ? { ...team, score: team.score + value } : team,
      ),
      actions: {
        ...game.actions,
        edges: [...game.actions.edges, optimisticActionData],
        totalCount: game.actions.totalCount + 1,
      },
    };

    console.log(optimisticGameData);
    console.log(optimisticActionData);

    return addGameScore({
      optimisticResponse: {
        addGameScore: {
          __typename: "AddGameScorePayload" as const,
          action: optimisticActionData,
          game: optimisticGameData,
        },
      },
      variables: {
        gameId: game.id,
        input: {
          key,
          value,
          occurredToTeamId: teamId,
        },
      },
    });
  };

  const [updateGameScore, { loading: updateLoading }] = useMutation(
    UpdateGameScoreDocument,
  );

  const updateScore = async ({
    actionId,
    value,
    key = null,
    teamId,
  }: {
    actionId: string;
    value: number;
    key?: string | null;
    teamId: string;
  }) => {
    console.log({ teamId });
    if (!game?.id) {
      throw new Error("Game not found");
    }

    // todo : update this to actually look up the team for proper cache consideration

    return updateGameScore({
      variables: {
        id: actionId,
        input: {
          key,
          value,
          occurredToTeamId: teamId,
        },
      },
      optimisticResponse: {
        updateGameScore: {
          __typename: "UpdateGameScorePayload" as const,
          action: {
            __typename: "GameScoreAction" as const,
            id: actionId,
            occurredAt: new Date().toISOString(),
            value,
            key,
            occurredByUser: null,
            occurredToTeam: {
              __typename: "Team" as const,
              id: teamId,
              name: "",
            },
          },
        },
      },
    });
  };

  return {
    addScore,
    updateScore,
    loading: addLoading || updateLoading,
  };
}

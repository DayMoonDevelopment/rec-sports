import { useMutation } from "@apollo/client";
import { AddGameScoreDocument } from "./mutations/create-game-event.generated";
import { GetGameDocument } from "./queries/get-game.generated";
import { useGame } from "./use-game.hook";

export function useAddScore() {
  const { data } = useGame({ fetchPolicy: "cache-only" });
  const game = data?.game;

  const [addGameScore, mutationOptions] = useMutation(AddGameScoreDocument, {
    refetchQueries: [{ query: GetGameDocument, variables: { id: game?.id } }],
    update: (cache, { data: mutationData }) => {
      if (!game?.id || !mutationData?.addGameScore) return;

      const existingData = cache.readQuery({
        query: GetGameDocument,
        variables: { id: game.id },
      });

      if (!existingData?.game) return;

      const newAction = mutationData.addGameScore.action;
      const teamId = newAction.occurredToTeam?.id;

      cache.writeQuery({
        query: GetGameDocument,
        variables: { id: game.id },
        data: {
          game: {
            ...existingData.game,
            teams: existingData.game.teams.map((gameTeam) =>
              gameTeam.team.id === teamId
                ? { ...gameTeam, score: gameTeam.score + newAction.value }
                : gameTeam,
            ),
            actions: {
              ...existingData.game.actions,
              edges: [
                {
                  __typename: "GameActionEdge",
                  node: newAction,
                  cursor: `cursor-${newAction.id}`,
                },
                ...existingData.game.actions.edges,
              ],
              totalCount: existingData.game.actions.totalCount + 1,
            },
          },
        },
      });
    },
  });

  function addScore({
    teamId,
    value,
    key = null,
  }: {
    teamId: string;
    value: number;
    key?: string | null;
  }) {
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
      __typename: "Game" as const,
      teams: game.teams.map((gameTeam) =>
        gameTeam.team.id === teamId
          ? { ...gameTeam, score: gameTeam.score + value }
          : gameTeam,
      ),
      actions: {
        ...game.actions,
        __typename: "GameActionsConnection" as const,
        edges: [
          {
            __typename: "GameActionEdge" as const,
            node: optimisticActionData,
            cursor: `cursor-${optimisticActionData.id}`,
          },
          ...game.actions.edges,
        ],
        totalCount: game.actions.totalCount + 1,
      },
    };

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
  }

  return [addScore, mutationOptions] as const;
}

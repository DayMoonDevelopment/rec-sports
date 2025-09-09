import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import {
  getSportScoringConfig,
  hasMultipleScoreTypes,
  getDefaultScoreType,
} from "~/lib/sport-scoring";

import { useGame } from "./use-game.hook";
import { useAddScore } from "./use-add-score.hook";
import { useUpdateScore } from "./use-update-score.hook";

import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { ScoreType } from "~/lib/sport-scoring";

export type TeamItemProps = {
  id: string;
  name: string;
  onPress: () => void;
  selected: boolean;
};

export type ScoreTypeItemProps = {
  actionKey: string;
  label: string;
  value: number;
  onPress: () => void;
  selected: boolean;
};

export type PlayerItemProps = {
  id: string;
  teamId: string;
  teamName: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoSource?: string;
  onPress: () => void;
  selected: boolean;
};

interface ScoreContextValue {
  // Selected state
  selectedTeamId: string | null;
  selectedPlayerId: string | null;
  selectedScoreType: ScoreType | null;
  gameScoreActionId: string | null;

  // UI data
  teams: TeamItemProps[];
  players: PlayerItemProps[];
  scoreTypes: ScoreTypeItemProps[];
  sportConfig: any;
  showScoreTypes: boolean;

  // Loading states
  isProcessing: boolean;
  isUpdating: boolean;

  // Actions
  openScoreSheet: (
    teamId?: string,
    gameScoreActionId?: string,
    userId?: string,
  ) => void;
  closeScoreSheet: () => void;
  handleSubmit: () => void;
  setSelectedTeam: (teamId: string) => void;
  setSelectedPlayer: (playerId: string | null) => void;
  setSelectedScoreType: (scoreType: ScoreType) => void;

  // Refs
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}

const ScoreContext = createContext<ScoreContextValue | undefined>(undefined);

export function useScoreSheet() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScoreSheet must be used within a ScoreProvider");
  }
  return context;
}

interface ScoreProviderProps {
  children: React.ReactNode;
}

export function ScoreProvider({ children }: ScoreProviderProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Selected state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [gameScoreActionId, setGameScoreActionId] = useState<string | null>(
    null,
  );
  const [selectedScoreType, setSelectedScoreType] = useState<ScoreType | null>(
    null,
  );

  // Hooks
  const { data } = useGame({
    fetchPolicy: "cache-only",
    onCompleted: (data) => {
      const sport = data?.game?.sport;
      if (sport && !selectedScoreType) {
        setSelectedScoreType(getDefaultScoreType(sport));
      }
    },
  });

  const [addScore, { loading: isAddingScore }] = useAddScore();
  const [updateScore, { loading: isUpdatingScore }] = useUpdateScore();

  // Derived data
  const game = data?.game;
  const sport = game?.sport;
  const sportConfig = sport ? getSportScoringConfig(sport) : null;
  const showScoreTypes = sport ? hasMultipleScoreTypes(sport) : false;
  const isUpdating = Boolean(gameScoreActionId);
  const isProcessing = isAddingScore || isUpdatingScore;

  // Team data
  const teams: TeamItemProps[] =
    game?.teams?.map((gameTeam) => ({
      id: gameTeam.team.id,
      name: gameTeam.team.name,
      onPress: () => setSelectedTeamId(gameTeam.team.id),
      selected: gameTeam.team.id === selectedTeamId,
    })) || [];

  // Player data
  const players: PlayerItemProps[] =
    game?.teams?.flatMap((gameTeam) => {
      return (
        gameTeam.team.members?.map((member) => ({
          id: member.id,
          teamId: gameTeam.team.id,
          teamName: gameTeam.team.name,
          displayName: member.displayName || undefined,
          firstName: member.firstName || undefined,
          lastName: member.lastName || undefined,
          photoSource: member.photo?.source || undefined,
          onPress: () =>
            setSelectedPlayerId(
              selectedPlayerId === member.id ? null : member.id,
            ),
          selected: selectedPlayerId === member.id,
        })) || []
      );
    }) || [];

  // Sort players: selected team first, then others
  const sortedPlayers = players.sort((a, b) => {
    if (a.teamId === selectedTeamId && b.teamId !== selectedTeamId) return -1;
    if (a.teamId !== selectedTeamId && b.teamId === selectedTeamId) return 1;
    return 0;
  });

  // Score type data
  const scoreTypes: ScoreTypeItemProps[] =
    sportConfig?.scoreTypes.map((scoreType) => ({
      ...scoreType,
      onPress: () => setSelectedScoreType(scoreType),
      selected: selectedScoreType?.actionKey === scoreType.actionKey,
    })) || [];

  // Actions
  const openScoreSheet = useCallback(
    (teamId?: string, actionId?: string, userId?: string) => {
      if (teamId) {
        setSelectedTeamId(teamId);
      }
      if (userId) {
        setSelectedPlayerId(userId);
      }
      setGameScoreActionId(actionId || null);
      bottomSheetRef.current?.present();
    },
    [],
  );

  const closeScoreSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedTeamId || !selectedScoreType || !game?.id) return;

    try {
      if (gameScoreActionId) {
        // Update existing score
        const input = {
          occurredToTeamId: selectedTeamId,
          value: selectedScoreType.value,
          key: selectedScoreType.actionKey,
          occurredByUserId: selectedPlayerId || undefined,
        };
        await updateScore({
          variables: { id: gameScoreActionId, input },
        });
      } else {
        // Add new score
        await addScore({
          teamId: selectedTeamId,
          value: selectedScoreType.value,
          key: selectedScoreType.actionKey,
        });
      }
      closeScoreSheet();
    } catch (error) {
      console.error(
        isUpdating ? "Failed to update score:" : "Failed to add score:",
        error,
      );
    }
  }, [
    selectedTeamId,
    selectedScoreType,
    selectedPlayerId,
    gameScoreActionId,
    game?.id,
    addScore,
    updateScore,
    closeScoreSheet,
    isUpdating,
  ]);

  const handleTeamChange = useCallback((teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedPlayerId(null); // Clear selected player when team changes
  }, []);

  const value: ScoreContextValue = {
    // Selected state
    selectedTeamId,
    selectedPlayerId,
    selectedScoreType,
    gameScoreActionId,

    // UI data
    teams,
    players: sortedPlayers,
    scoreTypes,
    sportConfig,
    showScoreTypes,

    // Loading states
    isProcessing,
    isUpdating,

    // Actions
    openScoreSheet,
    closeScoreSheet,
    handleSubmit,
    setSelectedTeam: handleTeamChange,
    setSelectedPlayer: setSelectedPlayerId,
    setSelectedScoreType,

    // Refs
    bottomSheetRef,
  };

  return (
    <ScoreContext.Provider value={value}>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </ScoreContext.Provider>
  );
}

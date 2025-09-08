import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useGame } from "./use-game.hook";
import { useAddScore } from "./use-add-score.hook";
import {
  getSportScoringConfig,
  hasMultipleScoreTypes,
  getDefaultScoreType,
  type ScoreType,
} from "~/lib/sport-scoring";

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

interface ScoreContextValue {
  selectedTeamId: string | null;
  selectedScoreType: ScoreType | null;
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  teams: TeamItemProps[];
  scoreTypes: ScoreTypeItemProps[];
  sportConfig: any;
  showScoreTypes: boolean;
  isAddingScore: boolean;
  openScoreSheet: (teamId?: string) => void;
  closeScoreSheet: () => void;
  handleAddScore: () => void;
  setSelectedTeam: (teamId: string) => void;
  setSelectedScoreType: (scoreType: ScoreType) => void;
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
  const [selectedTeamId, setSelectedTeamIdState] = useState<string | null>(
    null,
  );
  const [selectedScoreType, setSelectedScoreTypeState] =
    useState<ScoreType | null>(null);

  const { data } = useGame({
    fetchPolicy: "cache-only",
    onCompleted: (data) => {
      const game = data?.game;
      const sport = game?.sport;

      if (sport) {
        setSelectedScoreTypeState(getDefaultScoreType(sport));
      }
    },
  });
  const [addScore, { loading: isAddingScore }] = useAddScore();

  const game = data?.game;
  const sport = game?.sport;
  const sportConfig = sport ? getSportScoringConfig(sport) : null;
  const showScoreTypes = sport ? hasMultipleScoreTypes(sport) : false;

  const setSelectedTeam = useCallback((teamId: string) => {
    setSelectedTeamIdState(teamId);
  }, []);

  const setSelectedScoreType = useCallback((scoreType: ScoreType) => {
    setSelectedScoreTypeState(scoreType);
  }, []);

  const teams: TeamItemProps[] =
    game?.teams?.map((team) => ({
      id: team.team.id,
      name: team.team.name,
      onPress: () => setSelectedTeam(team.team.id),
      selected: team.team.id === selectedTeamId,
    })) || [];

  const scoreTypes: ScoreTypeItemProps[] =
    sportConfig?.scoreTypes.map((scoreType) => ({
      ...scoreType,
      onPress: () => setSelectedScoreType(scoreType),
      selected: selectedScoreType?.actionKey === scoreType.actionKey,
    })) || [];

  const handleAddScore = useCallback(() => {
    if (!selectedTeamId || !selectedScoreType) return;

    addScore({
      teamId: selectedTeamId,
      value: selectedScoreType.value,
      key: selectedScoreType.actionKey,
    })
      .then(() => {
        closeScoreSheet();
      })
      .catch((error) => {
        console.error("Failed to add score:", error);
      });
  }, [selectedTeamId, selectedScoreType, addScore]);

  const openScoreSheet = useCallback((teamId?: string) => {
    if (teamId) {
      setSelectedTeamIdState(teamId);
    }
    bottomSheetRef.current?.present();
  }, []);

  const closeScoreSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const value: ScoreContextValue = {
    selectedTeamId,
    selectedScoreType,
    bottomSheetRef,
    teams,
    scoreTypes,
    sportConfig,
    showScoreTypes,
    isAddingScore,
    openScoreSheet,
    closeScoreSheet,
    handleAddScore,
    setSelectedTeam,
    setSelectedScoreType,
  };

  return (
    <ScoreContext.Provider value={value}>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </ScoreContext.Provider>
  );
}

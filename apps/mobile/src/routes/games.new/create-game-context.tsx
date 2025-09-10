import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";
import { Sport } from "~/gql/types";
import type { SuggestedTeamsQuery } from "./queries/suggested-teams.generated";
import {
  TeamSelectionBottomSheet,
  type TeamSelectionBottomSheetRef,
} from "./components/team-selection-bottom-sheet";

type SelectedTeam = NonNullable<
  SuggestedTeamsQuery["suggestedTeams"]["edges"][0]["node"]
>;

interface CreateGameFormState {
  selectedSport: Sport | null;
  selectedTeams: SelectedTeam[];
  locationName: string;
  scheduledDate: string;
}

interface CreateGameContextValue extends CreateGameFormState {
  setSelectedSport: (sport: Sport | null) => void;
  setSelectedTeams: (teams: SelectedTeam[]) => void;
  setLocationName: (name: string) => void;
  setScheduledDate: (date: string) => void;
  addSelectedTeam: (team: SelectedTeam) => void;
  removeSelectedTeam: (teamId: string) => void;
  openTeamSelection: () => void;
  closeTeamSelection: () => void;
  canCreateGame: boolean;
}

const CreateGameContext = createContext<CreateGameContextValue | undefined>(
  undefined,
);

interface CreateGameProviderProps {
  children: ReactNode;
}

export function CreateGameProvider({ children }: CreateGameProviderProps) {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [locationName, setLocationName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const bottomSheetRef = useRef<TeamSelectionBottomSheetRef>(null);

  const addSelectedTeam = (team: SelectedTeam) => {
    if (!selectedTeams.find((t) => t.id === team.id)) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const removeSelectedTeam = (teamId: string) => {
    setSelectedTeams(selectedTeams.filter((team) => team.id !== teamId));
  };

  const openTeamSelection = () => {
    bottomSheetRef.current?.present();
  };

  const closeTeamSelection = () => {
    bottomSheetRef.current?.dismiss();
  };

  const canCreateGame =
    selectedSport &&
    selectedTeams.length >= 2 &&
    locationName.trim() &&
    scheduledDate;

  const value: CreateGameContextValue = {
    selectedSport,
    selectedTeams,
    locationName,
    scheduledDate,
    setSelectedSport,
    setSelectedTeams,
    setLocationName,
    setScheduledDate,
    addSelectedTeam,
    removeSelectedTeam,
    openTeamSelection,
    closeTeamSelection,
    canCreateGame,
  };

  return (
    <CreateGameContext.Provider value={value}>
      {children}

      {/* Team Selection Bottom Sheet - renders on top of all children */}
      <TeamSelectionBottomSheet
        ref={bottomSheetRef}
        selectedTeamIds={selectedTeams.map((t) => t.id)}
        onTeamSelect={addSelectedTeam}
        onTeamDeselect={removeSelectedTeam}
      />
    </CreateGameContext.Provider>
  );
}

export function useCreateGameForm() {
  const context = useContext(CreateGameContext);
  if (context === undefined) {
    throw new Error(
      "useCreateGameForm must be used within a CreateGameProvider",
    );
  }
  return context;
}

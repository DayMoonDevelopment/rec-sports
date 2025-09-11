import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";
import { Sport } from "~/gql/types";
import type { SuggestedTeamsQuery } from "./queries/suggested-teams.generated";
import type { LocationNodeFragment } from "~/routes/(map).index/queries/get-search-locations.generated";
import {
  TeamSelectionBottomSheet,
  type TeamSelectionBottomSheetRef,
} from "./components/team-selection-bottom-sheet";
import {
  LocationSelectionBottomSheet,
  type LocationSelectionBottomSheetRef,
} from "./components/location-selection-bottom-sheet";

type SelectedTeam = NonNullable<
  SuggestedTeamsQuery["suggestedTeams"]["edges"][0]["node"]
>;

interface CreateGameFormState {
  selectedSport: Sport | null;
  selectedTeams: SelectedTeam[];
  selectedLocation: LocationNodeFragment | null;
  locationName: string;
  scheduledDate: Date;
  isScheduleEnabled: boolean;
}

interface CreateGameContextValue extends CreateGameFormState {
  setSelectedSport: (sport: Sport | null) => void;
  setSelectedTeams: (teams: SelectedTeam[]) => void;
  setSelectedLocation: (location: LocationNodeFragment | null) => void;
  setLocationName: (name: string) => void;
  setScheduledDate: (date: Date) => void;
  setIsScheduleEnabled: (enabled: boolean) => void;
  addSelectedTeam: (team: SelectedTeam) => void;
  removeSelectedTeam: (teamId: string) => void;
  openTeamSelection: () => void;
  closeTeamSelection: () => void;
  openLocationSelection: () => void;
  closeLocationSelection: () => void;
  canCreateGame: boolean;
}

const CreateGameContext = createContext<CreateGameContextValue | undefined>(
  undefined,
);

interface CreateGameProviderProps {
  children: ReactNode;
}

function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export function CreateGameProvider({ children }: CreateGameProviderProps) {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationNodeFragment | null>(null);
  const [locationName, setLocationName] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date>(getDefaultDate());
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);

  const teamBottomSheetRef = useRef<TeamSelectionBottomSheetRef>(null);
  const locationBottomSheetRef = useRef<LocationSelectionBottomSheetRef>(null);

  const addSelectedTeam = (team: SelectedTeam) => {
    if (!selectedTeams.find((t) => t.id === team.id)) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const removeSelectedTeam = (teamId: string) => {
    setSelectedTeams(selectedTeams.filter((team) => team.id !== teamId));
  };

  const openTeamSelection = () => {
    teamBottomSheetRef.current?.present();
  };

  const closeTeamSelection = () => {
    teamBottomSheetRef.current?.dismiss();
  };

  const openLocationSelection = () => {
    locationBottomSheetRef.current?.present();
  };

  const closeLocationSelection = () => {
    locationBottomSheetRef.current?.dismiss();
  };

  const canCreateGame = Boolean(selectedSport && selectedTeams.length >= 1);

  const value: CreateGameContextValue = {
    selectedSport,
    selectedTeams,
    selectedLocation,
    locationName,
    scheduledDate,
    isScheduleEnabled,
    setSelectedSport,
    setSelectedTeams,
    setSelectedLocation,
    setLocationName,
    setScheduledDate,
    setIsScheduleEnabled,
    addSelectedTeam,
    removeSelectedTeam,
    openTeamSelection,
    closeTeamSelection,
    openLocationSelection,
    closeLocationSelection,
    canCreateGame,
  };

  return (
    <CreateGameContext.Provider value={value}>
      {children}

      {/* Team Selection Bottom Sheet - renders on top of all children */}
      <TeamSelectionBottomSheet
        ref={teamBottomSheetRef}
        selectedTeamIds={selectedTeams.map((t) => t.id)}
        onTeamSelect={addSelectedTeam}
        onTeamDeselect={removeSelectedTeam}
      />

      {/* Location Selection Bottom Sheet - renders on top of all children */}
      <LocationSelectionBottomSheet
        ref={locationBottomSheetRef}
        onLocationSelect={(location) => {
          setSelectedLocation(location);
          setLocationName(location.name);
        }}
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

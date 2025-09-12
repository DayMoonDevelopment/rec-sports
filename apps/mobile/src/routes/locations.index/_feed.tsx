import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { RecommendedLocations } from "./_recommended-locations";
import { SportFilters } from "./components/sport-filters";
import { Sport } from "~/gql/types";
import { View } from "react-native";

export interface FeedProps {
  onSportFilterChange: (sport: Sport) => void;
}

export function Feed({ onSportFilterChange }: FeedProps) {
  return (
    <BottomSheetScrollView>
      <SportFilters onSportFilterChange={onSportFilterChange} />
      <View className="h-10" />
      <RecommendedLocations />
    </BottomSheetScrollView>
  );
}

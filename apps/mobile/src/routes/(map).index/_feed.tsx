import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RecommendedLocations } from "./_recommended-locations";

export function Feed() {
  return (
    <BottomSheetScrollView className="px-4">
      <RecommendedLocations />
    </BottomSheetScrollView>
  );
}

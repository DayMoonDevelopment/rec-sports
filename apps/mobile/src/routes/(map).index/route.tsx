import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { SearchHeader } from "./_search-header";
import { RecommendedLocations } from "./_recommended-locations";

export function Component() {
  return (
    <View className="flex-1">
      <SearchHeader />
      <BottomSheetScrollView className="px-4">
        <RecommendedLocations hasSearchTerm={false} />
      </BottomSheetScrollView>
    </View>
  );
}

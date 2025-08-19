import { View, Text, FlatList } from "react-native";
import { SuggestedLocation } from "./_suggested-location";
import type { Location } from "@rec/types";

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

interface SuggestedLocationsProps {
  hasSearchTerm: boolean;
}

export function SuggestedLocations({ hasSearchTerm }: SuggestedLocationsProps) {
  // Static placeholder - empty array for now
  const suggestedItems: Location[] = [];

  // Get top 5 suggested locations
  const topSuggested = suggestedItems.slice(0, 5);

  const handleLocationPress = (location: Location) => {
    console.log("Selected location:", location.name);
  };

  if (hasSearchTerm) {
    return null; // Don't show suggested locations when there's a search term
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-foreground pb-2">Nearby</Text>

      <FlatList
        horizontal
        data={topSuggested}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => (
          <SuggestedLocation location={item} onPress={handleLocationPress} />
        )}
        ItemSeparatorComponent={HorizontalItemSeparatorComponent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

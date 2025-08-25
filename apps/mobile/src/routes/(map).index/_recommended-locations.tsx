import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";

import { RecommendedLocation } from "./_recommended-location";
import { GET_RECOMMENDED_LOCATIONS } from "./queries/get-recommended-locations";

import type { Location } from "@rec/types";

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

interface RecommendedLocationsProps {
  hasSearchTerm: boolean;
}

export function RecommendedLocations({
  hasSearchTerm,
}: RecommendedLocationsProps) {
  // Query for recommended locations
  const { data, loading, error } = useQuery(GET_RECOMMENDED_LOCATIONS, {
    variables: {
      limit: 5, // Get top 5 suggested locations
    },
    fetchPolicy: "no-cache",
  });

  const suggestedItems = data?.locations.nodes || [];

  const handleLocationPress = (location: Location) => {
    // Navigate to the location detail route
    router.push(`/(map)/${location.id}`);
  };

  if (hasSearchTerm) {
    return null; // Don't show suggested locations when there's a search term
  }

  // Don't render if no data and not loading
  if (!loading && suggestedItems.length === 0) {
    return null;
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-foreground pb-2">
        Recommended
      </Text>

      {loading && suggestedItems.length === 0 ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" className="text-muted-foreground" />
        </View>
      ) : error ? (
        <View className="py-4">
          <Text className="text-muted-foreground text-sm">
            Unable to load nearby locations
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={suggestedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecommendedLocation
              location={item}
              onPress={handleLocationPress}
            />
          )}
          ItemSeparatorComponent={HorizontalItemSeparatorComponent}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

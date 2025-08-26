import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";

import { RecommendedLocation } from "./_recommended-location";
import { GET_RECOMMENDED_LOCATIONS } from "./queries/get-recommended-locations";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import type { Location, Region } from "@rec/types";

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

interface RecommendedLocationsProps {
  hasSearchTerm: boolean;
}

export function RecommendedLocations({
  hasSearchTerm,
}: RecommendedLocationsProps) {
  const { currentRegion } = useMap();

  // Convert current map region to API region format
  const apiRegion: Region | undefined = currentRegion
    ? {
        boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 0.2), // 20% buffer for better UX
      }
    : undefined;

  // Query for recommended locations
  const { data, loading, error } = useQuery(GET_RECOMMENDED_LOCATIONS, {
    variables: {
      limit: 5, // Get top 5 suggested locations
      region: apiRegion,
    },
    fetchPolicy: "no-cache", // Use cache but also fetch fresh data
    skip: !currentRegion, // Skip query until we have a region
  });

  const suggestedItems = data?.locations.nodes || [];

  const handleLocationPress = (location: Location) => {
    // Navigate to the location detail route
    router.push(`/${location.id}`);
  };

  if (hasSearchTerm) {
    return null; // Don't show suggested locations when there's a search term
  }

  // Don't render if no data and not loading, or if we don't have a region yet
  if (!currentRegion || (!loading && suggestedItems.length === 0)) {
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

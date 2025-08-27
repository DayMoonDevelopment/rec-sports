import { View, Text, FlatList } from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";

import { RecommendedLocation } from "./_recommended-location";
import { GetRecommendedLocationsDocument } from "./queries/get-recommended-locations.generated";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import type { Location, Region } from "~/gql/types";

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

export function RecommendedLocations() {
  const { currentRegion } = useMap();

  // Convert current map region to API region format
  const apiRegion: Region | undefined = currentRegion
    ? {
        boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 0.2), // 20% buffer for better UX
      }
    : undefined;

  // Query for recommended locations
  const { data, loading } = useQuery(GetRecommendedLocationsDocument, {
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

  // Don't render if no data and not loading, or if we don't have a region yet
  if (!currentRegion || (!loading && suggestedItems.length === 0)) {
    return null;
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-foreground pb-2">
        Recommended
      </Text>

      <FlatList
        horizontal
        data={suggestedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecommendedLocation location={item} onPress={handleLocationPress} />
        )}
        ItemSeparatorComponent={HorizontalItemSeparatorComponent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

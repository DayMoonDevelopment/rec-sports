import { View, Text } from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { RecommendedLocation } from "./_recommended-location";
import { GetRecommendedLocationsDocument } from "./queries/get-recommended-locations.generated";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import type { Region } from "~/gql/types";
import type { LocationNodeFragment } from "./queries/get-recommended-locations.generated";

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

export function RecommendedLocations() {
  const { currentRegion, setLocations } = useMap();

  // Convert current map region to API region format
  const apiRegion: Region | undefined = currentRegion
    ? {
        boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 0.2), // 20% buffer for better UX
      }
    : undefined;

  // Query for recommended locations
  const { data, loading } = useQuery(GetRecommendedLocationsDocument, {
    variables: {
      first: 5, // Get top 5 suggested locations
      region: apiRegion,
      after: null, // Start from beginning
    },
    skip: !currentRegion, // Skip query until we have a region
    onCompleted: (data) => {
      // Update map with recommended locations
      const locations = data?.locations.edges?.map((edge) => edge.node) || [];
      setLocations(locations);
    },
  });

  const suggestedItems = data?.locations.edges?.map((edge) => edge.node) || [];

  const handleLocationPress = (location: LocationNodeFragment) => {
    // Navigate to the location detail route with lat/lng for immediate animation
    router.push(
      `/locations/${location.id}?lat=${location.geo.latitude}&lng=${location.geo.longitude}`,
    );
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

      <BottomSheetFlatList
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

import { View, Text } from "react-native";
import { useQuery } from "@apollo/client";
import { FlatList } from "react-native-gesture-handler";

import { RecommendedLocation } from "./_recommended-location";
import { GetRecommendedLocationsDocument } from "./queries/get-recommended-locations.generated";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import type { Region } from "~/gql/types";

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

  const locations = data?.locations.edges?.map((edge) => edge.node) || [];

  // Don't render if no data and not loading, or if we don't have a region yet
  if (!currentRegion || (!loading && locations.length === 0)) {
    return null;
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-foreground pb-2">
        Recommended
      </Text>

      <FlatList
        horizontal
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecommendedLocation location={item} />}
        ItemSeparatorComponent={HorizontalItemSeparatorComponent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

import { View, Text } from "react-native";
import { useQuery } from "@apollo/client";

import { LocationItem } from "./_location-item";
import { GetRecommendedLocationsDocument } from "./queries/get-recommended-locations.generated";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import type { Region } from "~/gql/types";

export function RecommendedLocations() {
  const { currentRegion } = useMap();

  // Convert current map region to API region format
  const apiRegion: Region | undefined = currentRegion
    ? {
        boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 1), // 20% buffer for better UX
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
  });

  const locations = data?.locations.edges?.map((edge) => edge.node) || [];

  // Don't render if no data and not loading, or if we don't have a region yet
  if (!currentRegion || (!loading && locations.length === 0)) {
    return null;
  }

  return (
    <View className="flex flex-col">
      {locations.map((location) => (
        <LocationItem key={location.id} location={location} />
      ))}
    </View>
  );
}

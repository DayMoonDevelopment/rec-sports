import { useDeferredValue } from "react";
import { StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClusteredMapView from "react-native-map-clustering";

import { useQuery } from "@apollo/client";

import { useMap } from "~/components/map.context";
import { MapMarker } from "./_map-marker";

import { GET_MAP_LOCATIONS } from "./queries/get-map-locations";

const BUFFER_MULTIPLIER = 2;

// Initial region to show the entire United States
const US_INITIAL_REGION = {
  latitude: 39.8283, // Center of the continental US
  longitude: -98.5795, // Center of the continental US
  latitudeDelta: 25, // Covers from Canada border to Mexico border
  longitudeDelta: 50, // Covers from Atlantic to Pacific
};

export function MapViewComponent() {
  const { height: screenHeight } = useWindowDimensions();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const { mapRef } = useMap();
  const { data, loading, error, client } = useQuery(GET_MAP_LOCATIONS, {
    fetchPolicy: "network-only",
  });

  // Static placeholder - empty array for now
  const items = data?.locations.nodes || [];

  const mapBottomPadding =
    Platform.OS === "ios"
      ? (screenHeight - topInset) * 0.5 - bottomInset
      : screenHeight * 0.5 + 16;

  // Handle region change - no-op for now since we're using static data
  const handleRegionChange = (region: any) => {
    // Placeholder - no data fetching logic
  };

  return (
    <ClusteredMapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      initialRegion={US_INITIAL_REGION}
      mapPadding={{
        bottom: mapBottomPadding,
        left: 20,
        right: 20,
        top: 20,
      }}
      clusteringEnabled={true}
      onRegionChangeComplete={handleRegionChange}
    >
      {items.map((location) => {
        return <MapMarker key={location.id} location={location} />;
      })}
    </ClusteredMapView>
  );
}

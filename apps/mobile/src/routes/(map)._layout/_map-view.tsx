import { StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { router } from "expo-router";

import { useQuery } from "@apollo/client";

import { useMap } from "~/components/map.context";
import { MapMarker } from "./_map-marker";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import { SearchLocationsDocument } from "./queries/get-map-locations.generated";

import type { Region } from "react-native-maps";

// Initial region to show the entire United States
const US_INITIAL_REGION = {
  latitude: 39.8283, // Center of the continental US (near Lebanon, Kansas)
  longitude: -98.5795, // Center of the continental US
  latitudeDelta: 20, // Covers roughly from southern Florida (~24.5°N) to northern US border (~49°N)
  longitudeDelta: 40, // Covers from eastern Maine (~66.9°W) to western Washington (~124.7°W)
};

const US_INITIAL_BOUNDING_BOX_BUFFERED = regionToBoundingBoxWithBuffer(
  US_INITIAL_REGION,
  0.1,
);

const PAGE_PARAMS = {
  first: 100,
  after: null,
};

export function MapViewComponent() {
  const { height: screenHeight } = useWindowDimensions();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const {
    mapRef,
    focusedMarkerId,
    setFocusedMarkerId,
    hideMarkerCallout,
    zoomOut,
    onRegionChange,
  } = useMap();

  const { data, refetch } = useQuery(SearchLocationsDocument, {
    fetchPolicy: "no-cache", // map-based search is far too unique to be safely cachable
    variables: {
      ...PAGE_PARAMS,
      region: {
        boundingBox: US_INITIAL_BOUNDING_BOX_BUFFERED,
      },
    },
  });

  const items = data?.locations.edges?.map((edge) => edge.node) || [];

  const mapBottomPadding =
    Platform.OS === "ios"
      ? (screenHeight - topInset) * 0.5 - bottomInset
      : screenHeight * 0.5 + 16;

  // Handle region change - refetch data for the new region with buffer
  const handleRegionChange = (region: Region) => {
    // Update the map context with the new region
    onRegionChange(region);

    const boundingBoxWithBuffer = regionToBoundingBoxWithBuffer(region, 1);

    refetch({
      ...PAGE_PARAMS,
      after: null, // Reset cursor when region changes
      region: {
        boundingBox: boundingBoxWithBuffer,
      },
    });
  };

  // Handle map press - unfocus any focused location and navigate back
  const handleMapPress = () => {
    if (focusedMarkerId) {
      hideMarkerCallout(focusedMarkerId);
      setFocusedMarkerId(null);
      zoomOut(5);

      // Check if there are screens in the navigation stack to go back to
      if (router.canGoBack()) {
        router.back();
      } else {
        // If no screens in stack, reset to the index route
        router.replace("/");
      }
    }
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      initialRegion={US_INITIAL_REGION}
      mapPadding={{
        bottom: mapBottomPadding,
        top: 0,
        left: 0,
        right: 0,
      }}
      onRegionChangeComplete={handleRegionChange}
      onPress={handleMapPress}
    >
      {items.map((location) => {
        return <MapMarker key={location.id} location={location} />;
      })}
    </MapView>
  );
}

import { StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Polygon } from "react-native-maps";
import { router } from "expo-router";

import { useMap } from "~/components/map.context";
import { MapMarker } from "./_map-marker";

import type { Region } from "react-native-maps";

// Initial region to show the entire United States
const US_INITIAL_REGION = {
  latitude: 39.8283, // Center of the continental US (near Lebanon, Kansas)
  longitude: -98.5795, // Center of the continental US
  latitudeDelta: 20, // Covers roughly from southern Florida (~24.5°N) to northern US border (~49°N)
  longitudeDelta: 40, // Covers from eastern Maine (~66.9°W) to western Washington (~124.7°W)
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
    locations,
    bounds,
  } = useMap();

  const mapBottomPadding =
    Platform.OS === "ios"
      ? (screenHeight - topInset) * 0.5 - bottomInset
      : screenHeight * 0.5 + 16;

  // Handle region change - just update the map context
  const handleRegionChange = (region: Region) => {
    onRegionChange(region);
  };

  // Handle map press - unfocus any focused location and navigate back
  const handleMapPress = () => {
    if (focusedMarkerId) {
      hideMarkerCallout(focusedMarkerId);
      setFocusedMarkerId(null);
      zoomOut(2);

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
      mapType="satellite"
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
      rotateEnabled={false}
      pitchEnabled={false}
    >
      {!bounds &&
        locations.map((location) => {
          return <MapMarker key={location.id} location={location} />;
        })}

      {bounds && bounds.length > 0 && (
        <Polygon
          coordinates={bounds}
          fillColor="rgba(0, 0, 0, 0.1)"
          strokeColor="rgba(0, 0, 0, 1)"
          strokeWidth={2}
        />
      )}
    </MapView>
  );
}

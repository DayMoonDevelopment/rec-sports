import { StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Polygon } from "react-native-maps";
import { cva } from "class-variance-authority";

import { Sport } from "~/gql/types";

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

const polygonStyles = cva("", {
  variants: {
    variant: {
      default: "text-primary",
      [Sport.Baseball]: "text-sport-baseball",
      [Sport.Kickball]: "text-sport-kickball",
      [Sport.Basketball]: "text-sport-basketball",
      [Sport.Pickleball]: "text-sport-pickleball",
      [Sport.Tennis]: "text-sport-tennis",
      [Sport.Golf]: "text-sport-golf",
      [Sport.DiscGolf]: "text-sport-disc-golf",
      [Sport.Hockey]: "text-sport-hockey",
      [Sport.Softball]: "text-sport-softball",
      [Sport.Soccer]: "text-sport-soccer",
      [Sport.Football]: "text-sport-football",
      [Sport.Volleyball]: "text-sport-volleyball",
      [Sport.Ultimate]: "text-sport-ultimate",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function MapViewComponent() {
  const { height: screenHeight } = useWindowDimensions();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const { mapRef, onRegionChange, markers, polygons } = useMap();

  const mapBottomPadding =
    Platform.OS === "ios"
      ? (screenHeight - topInset) * 0.5 - bottomInset
      : screenHeight * 0.5 + 16;

  // Handle region change - just update the map context
  const handleRegionChange = (region: Region) => {
    onRegionChange(region);
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
      rotateEnabled={false}
      pitchEnabled={false}
    >
      {markers.map((marker) => {
        return (
          <MapMarker
            key={marker.id}
            id={marker.id}
            geo={marker.geo}
            displayType={marker.displayType}
          />
        );
      })}

      {polygons.map((polygon) => (
        <Polygon
          className={polygonStyles({ variant: polygon.variant })}
          key={polygon.id}
          coordinates={polygon.coordinates}
          strokeWidth={2}
        />
      ))}
    </MapView>
  );
}

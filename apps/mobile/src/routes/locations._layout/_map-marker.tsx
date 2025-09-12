import { useRef, useEffect } from "react";
import { router } from "expo-router";
import { useMap } from "~/components/map.context";
import { SportMarker } from "./_sport-marker";
import { LocationMarker } from "./_location-marker";

import type { Sport } from "~/gql/types";

interface MapMarkerProps {
  id?: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  displayType: "location" | Sport;
}

export function MapMarker({ id, geo, displayType }: MapMarkerProps) {
  const markerRef = useRef<any>(null);
  const { addMarkerRef, removeMarkerRef } = useMap();

  const handleMarkerPress = () => {
    if (displayType === "location" && id) {
      // If not focused and it's a location marker, navigate to the location detail route
      router.push(`/locations/${id}`);
    }
    // For facility markers, we don't navigate anywhere - they just show the callout
  };

  useEffect(() => {
    // Add the ref when component mounts (only if id is provided)
    if (id) {
      addMarkerRef(id, markerRef);

      // Remove the ref when component unmounts
      return () => {
        removeMarkerRef(id);
      };
    }
  }, [id, addMarkerRef, removeMarkerRef]);

  const coordinate = {
    latitude: geo?.latitude || 0,
    longitude: geo?.longitude || 0,
  };

  // Render different marker types based on displayType
  if (displayType === "location") {
    return (
      <LocationMarker
        id={id}
        coordinate={coordinate}
        markerRef={markerRef}
        onPress={handleMarkerPress}
      />
    );
  } else {
    return (
      <SportMarker
        id={id}
        sport={displayType}
        coordinate={coordinate}
        markerRef={markerRef}
      />
    );
  }
}

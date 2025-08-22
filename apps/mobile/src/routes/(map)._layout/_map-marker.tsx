import { useRef, useEffect } from "react";
import { Marker } from "react-native-maps";
import { router } from "expo-router";
import { useMap } from "~/components/map.context";

import type { Location } from "@rec/types";

interface MapMarkerProps {
  location: Location;
}

export function MapMarker({ location }: MapMarkerProps) {
  const markerRef = useRef<typeof Marker>(null);
  const { addMarkerRef, removeMarkerRef, focusedMarkerId } = useMap();

  const title = location.name;
  const description = location.address
    ? `${location.address.street}, ${location.address.city} ${location.address.stateCode} ${location.address.postalCode}`
    : undefined;

  // Hide this marker if another marker is focused
  const isHidden = focusedMarkerId && focusedMarkerId !== location.id;

  const handleMarkerPress = () => {
    // Navigate to the location detail route with location data
    router.push(`/(map)/${location.id}`);
  };

  useEffect(() => {
    // Add the ref when component mounts
    addMarkerRef(location.id, markerRef);

    // Remove the ref when component unmounts
    return () => {
      removeMarkerRef(location.id);
    };
  }, [location.id, addMarkerRef, removeMarkerRef]);

  // Don't render the marker if it should be hidden
  if (isHidden) {
    return null;
  }

  return (
    <Marker
      ref={markerRef}
      coordinate={{
        latitude: location.geo.latitude,
        longitude: location.geo.longitude,
      }}
      title={title}
      description={description}
      onPress={handleMarkerPress}
    />
  );
}

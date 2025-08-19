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
  const { addMarkerRef, removeMarkerRef } = useMap();

  useEffect(() => {
    // Add the ref when component mounts
    addMarkerRef(location.id, markerRef);

    // Remove the ref when component unmounts
    return () => {
      removeMarkerRef(location.id);
    };
  }, [location.id, addMarkerRef, removeMarkerRef]);

  const handleMarkerPress = () => {
    // Navigate to the location detail route with location data
    router.push(`/(map)/${location.id}`);
  };

  return (
    <Marker
      ref={markerRef}
      coordinate={{
        latitude: location.geo.latitude,
        longitude: location.geo.longitude,
      }}
      title={location.name}
      description={`${location.address.street}, ${location.address.city} ${location.address.state} ${location.address.postalCode}`}
      onPress={handleMarkerPress}
    />
  );
}

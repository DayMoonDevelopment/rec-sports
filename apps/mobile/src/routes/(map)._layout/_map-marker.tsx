import { useRef, useEffect } from "react";
import { Marker } from "react-native-maps";
import { router } from "expo-router";
import { useMap } from "~/components/map.context";

import type { LocationNodeFragment } from "~/routes/(map).index/queries/get-search-locations.generated";

interface MapMarkerProps {
  location: LocationNodeFragment;
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

  // Check if this marker is currently focused
  const isFocused = focusedMarkerId === location.id;

  const handleMarkerPress = () => {
    if (!isFocused) {
      // If not focused, navigate to the location detail route with lat/lng for immediate animation
      router.push(
        `/locations//${location.id}?lat=${location.geo?.latitude}&lng=${location.geo?.longitude}`,
      );
    }
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
        latitude: location.geo?.latitude || 0,
        longitude: location.geo?.longitude || 0,
      }}
      title={title}
      description={description}
      onPress={handleMarkerPress}
    />
  );
}

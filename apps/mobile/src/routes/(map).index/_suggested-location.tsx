import { Pressable } from "react-native";
import { router } from "expo-router";
import { Badge, BadgeText } from "~/ui/badge";
import { useMap } from "~/components/map.context";

import type { Location } from "@rec/types";

interface SuggestedLocationProps {
  location: Location;
  onPress?: (location: Location) => void;
}

export function SuggestedLocation({
  location,
  onPress,
}: SuggestedLocationProps) {
  const { showMarkerCallout, animateToLocation } = useMap();

  const handlePress = () => {
    // Animate to the location on the map
    if (location._geoloc?.lat && location._geoloc?.lng) {
      animateToLocation(location._geoloc.lat, location._geoloc.lng);
    }

    // Show the marker callout on the map
    showMarkerCallout(location.objectID);

    // Navigate to the location detail route with location data
    router.push({
      pathname: `/(map)/${location.objectID}`,
      params: {
        locationData: JSON.stringify(location),
      },
    });

    // Call the optional onPress callback
    onPress?.(location);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="active:bg-opacity/50 transition-opacity"
    >
      <Badge variant="secondary" size="default">
        <BadgeText>{location.name}</BadgeText>
      </Badge>
    </Pressable>
  );
}

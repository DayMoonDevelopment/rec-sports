import { Pressable } from "react-native";
import { Link } from "expo-router";
import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";
import { useMap } from "~/components/map.context";

import { PinIcon } from "~/icons/pin";

import type { LocationNodeFragment } from "./queries/get-recommended-locations.generated";

interface RecommendedLocationProps {
  location: LocationNodeFragment;
}

export function RecommendedLocation({ location }: RecommendedLocationProps) {
  const { showMarkerCallout, animateToLocation } = useMap();

  const handlePress = () => {
    // Animate to the location on the map
    if (location.geo?.latitude && location.geo?.longitude) {
      animateToLocation(location.geo.latitude, location.geo.longitude);
    }

    // Show the marker callout on the map
    showMarkerCallout(location.id);
  };

  const locationUrl = `/locations/${location.id}?lat=${location.geo?.latitude}&lng=${location.geo?.longitude}`;

  return (
    <Link href={locationUrl} asChild>
      <Pressable
        onPress={handlePress}
        className="active:bg-opacity/50 transition-opacity"
      >
        <Badge variant="secondary" size="default">
          <BadgeIcon Icon={PinIcon} />
          <BadgeText>{location.name}</BadgeText>
        </Badge>
      </Pressable>
    </Link>
  );
}

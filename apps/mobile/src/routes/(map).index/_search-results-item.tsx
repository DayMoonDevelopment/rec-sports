import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useMap } from "~/components/map.context";
import type { Location } from "@rec/types";

interface SearchResultsItemProps {
  location: Location;
}

export function SearchResultsItem({ location }: SearchResultsItemProps) {
  const { animateToLocation, showMarkerCallout } = useMap();

  function handlePress() {
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
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-card active:opacity-50 p-4 rounded-lg border border-border transition-opacity"
    >
      <Text className="text-foreground font-semibold text-lg mb-1">
        {location.name}
      </Text>

      {location.address && (
        <Text className="text-foreground/70 text-sm mb-2">
          {location.address}
        </Text>
      )}

      {location.sports && location.sports.length > 0 && (
        <View className="flex-row flex-wrap gap-1">
          {location.sports.slice(0, 3).map((sport, index) => (
            <View key={index} className="bg-primary/10 px-2 py-1 rounded">
              <Text className="text-primary text-xs">{sport}</Text>
            </View>
          ))}
          {location.sports.length > 3 && (
            <View className="bg-muted px-2 py-1 rounded">
              <Text className="text-muted-foreground text-xs">
                +{location.sports.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

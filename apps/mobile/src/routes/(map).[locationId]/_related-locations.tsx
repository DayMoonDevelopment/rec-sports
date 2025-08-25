import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { GET_RELATED_LOCATIONS } from "./queries/get-related-locations";
import { RelatedLocationItem } from "./_related-locations-item";
import { useMap } from "~/components/map.context";

import type { Location } from "@rec/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 8;

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

interface RelatedLocationsProps {
  currentLocation: Location;
}

export function RelatedLocations({ currentLocation }: RelatedLocationsProps) {
  const { animateToLocation, showMarkerCallout } = useMap();

  const { data, loading, error } = useQuery(GET_RELATED_LOCATIONS, {
    variables: {
      latitude: currentLocation.geo?.latitude || 0,
      longitude: currentLocation.geo?.longitude || 0,
    },
    skip: !currentLocation.geo?.latitude || !currentLocation.geo?.longitude,
    fetchPolicy: "no-cache",
  });

  const relatedLocations =
    data?.relatedLocations.nodes.filter(
      ({ id }) => id !== currentLocation.id,
    ) || [];

  const handleLocationPress = (location: Location) => {
    // Animate to the location on the map
    if (location.geo?.latitude && location.geo?.longitude) {
      animateToLocation(location.geo.latitude, location.geo.longitude);
    }

    // Show the marker callout on the map
    showMarkerCallout(location.id);

    // Navigate to the location detail route
    router.push(`/${location.id}`);
  };

  if (!currentLocation.geo?.latitude || !currentLocation.geo?.longitude) {
    return null;
  }

  if (loading && relatedLocations.length === 0) {
    return (
      <View className="py-4">
        <Text className="text-lg font-semibold text-foreground mb-4">
          Related Locations
        </Text>
        <View className="items-center py-8">
          <ActivityIndicator size="small" className="text-muted-foreground" />
        </View>
      </View>
    );
  }

  if (error || (!loading && relatedLocations.length === 0)) {
    return null;
  }

  return (
    <View className="py-4">
      <Text className="text-lg font-semibold text-foreground mb-2 px-4">
        Nearby locations
      </Text>

      <BottomSheetFlatList
        horizontal
        data={relatedLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RelatedLocationItem location={item} onPress={handleLocationPress} />
        )}
        ItemSeparatorComponent={HorizontalItemSeparatorComponent}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 14,
        }}
      />
    </View>
  );
}

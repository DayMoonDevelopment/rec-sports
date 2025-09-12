import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { GetRelatedLocationsDocument } from "./queries/get-related-locations.generated";
import { RelatedLocationItem } from "./_related-locations-item";

import type { LocationNodeFragment } from "./queries/get-related-locations.generated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 8;

function HorizontalItemSeparatorComponent() {
  return <View className="w-2" />;
}

interface RelatedLocationsProps {
  reference: LocationNodeFragment;
}

export function RelatedLocations({
  reference: currentLocation,
}: RelatedLocationsProps) {
  const { data, loading, error } = useQuery(GetRelatedLocationsDocument, {
    fetchPolicy: "cache-and-network",
    variables: {
      latitude: currentLocation.geo?.latitude || 0,
      longitude: currentLocation.geo?.longitude || 0,
      radiusMiles: 100,
      first: 6,
      after: null,
    },
    skip: !currentLocation.geo?.latitude || !currentLocation.geo?.longitude,
  });

  const relatedLocations =
    data?.relatedLocations.edges
      ?.map((edge) => edge.node)
      .filter(({ id }) => id !== currentLocation.id) || [];

  const handleLocationPress = (location: LocationNodeFragment) => {
    // Simply navigate to the location detail route
    router.push(`/locations/${location.id}`);
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
      <Text className="text-lg font-semibold text-foreground mb-2 pl-5">
        Nearby locations
      </Text>

      <BottomSheetFlatList
        contentContainerClassName="px-4"
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
      />
    </View>
  );
}

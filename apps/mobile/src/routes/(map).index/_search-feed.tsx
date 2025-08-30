import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { router } from "expo-router";

import { useMap } from "~/components/map.context";
import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";
import { GetSearchLocationsDocument } from "./queries/get-search-locations.generated";

import type { LocationNodeFragment } from "./queries/get-search-locations.generated";

interface SearchFeedProps {
  searchQuery: string;
}

interface SearchLocationItemProps {
  location: LocationNodeFragment;
  onPress: (location: LocationNodeFragment) => void;
}

function SearchLocationItem({ location, onPress }: SearchLocationItemProps) {
  return (
    <Pressable
      className="mx-4 mb-3 active:opacity-75"
      onPress={() => onPress(location)}
    >
      <View className="bg-card border border-border rounded-3xl p-4">
        <View className="flex-row items-start gap-3">
          {/* Tree Icon */}
          <View className="bg-green-100 dark:bg-green-800 p-2 rounded-xl">
            <TreeIcon className="size-6 text-green-700 dark:text-green-500" />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-foreground font-semibold text-base mb-1">
              {location.name}
            </Text>

            {location.address && (
              <Text className="text-muted-foreground text-sm mb-3">
                {location.address.street && `${location.address.street}, `}
                {location.address.city}, {location.address.stateCode}
              </Text>
            )}

            {/* Sport Badges */}
            {location.sports && location.sports.length > 0 && (
              <View className="flex-row flex-wrap gap-1">
                {location.sports.slice(0, 2).map((sport) => (
                  <Badge key={sport} variant={sport} size="sm">
                    <BadgeIcon Icon={SportIcon} sport={sport} />
                    <BadgeText>{sportLabel(sport)}</BadgeText>
                  </Badge>
                ))}
                {location.sports.length > 2 && (
                  <Badge variant="secondary" size="sm">
                    <BadgeText>+{location.sports.length - 2}</BadgeText>
                  </Badge>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function SearchFeed({ searchQuery }: SearchFeedProps) {
  const { currentRegion, animateToLocation, setFocusedMarkerId } = useMap();

  // Create expanded region for search (add margins)
  const searchRegion = currentRegion
    ? {
        centerPoint: {
          point: {
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          },
          radiusMiles: Math.max(
            // Calculate approximate radius from region deltas
            currentRegion.latitudeDelta * 69 * 1.5, // Add 50% margin
            currentRegion.longitudeDelta * 69 * 1.5,
          ),
        },
      }
    : undefined;

  const { data, loading, error } = useQuery(GetSearchLocationsDocument, {
    variables: {
      query: searchQuery,
      region: searchRegion,
      limit: 100,
    },
    skip: !searchQuery.trim(),
    fetchPolicy: "no-cache",
  });

  const searchResults = data?.locations.nodes || [];

  const handleLocationPress = (location: LocationNodeFragment) => {
    // Animate to location on map
    if (location.geo?.latitude && location.geo?.longitude) {
      animateToLocation(location.geo.latitude, location.geo.longitude);
    }
    setFocusedMarkerId(location.id);

    // Navigate to location detail with lat/lng for immediate animation
    router.push(`/${location.id}?lat=${location.geo.latitude}&lng=${location.geo.longitude}`);
  };

  if (!searchQuery.trim()) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-muted-foreground text-center">
          Start typing to search for locations
        </Text>
      </View>
    );
  }

  if (loading && searchResults.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ActivityIndicator size="large" className="text-primary mb-4" />
        <Text className="text-muted-foreground text-center">
          {`Searching for "${searchQuery}"...`}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-muted-foreground text-center">
          Unable to search locations. Please try again.
        </Text>
      </View>
    );
  }

  if (searchResults.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-foreground font-semibold text-lg mb-2">
          No results found
        </Text>
        <Text className="text-muted-foreground text-center">
          We couldn't find any locations matching "{searchQuery}" in this area.
        </Text>
        <Text className="text-muted-foreground text-center mt-2">
          Try adjusting your search or zoom out on the map.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="px-4 py-3 border-b border-border bg-muted/30">
        <Text className="text-muted-foreground text-sm">
          {data?.locations.totalCount} result
          {data?.locations.totalCount !== 1 ? "s" : ""} for "{searchQuery}"
        </Text>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchLocationItem location={item} onPress={handleLocationPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
      />
    </View>
  );
}

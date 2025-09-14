import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  useSearchBox,
  useGeoSearch,
  useInstantSearch,
} from "react-instantsearch-core";

import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import { Sport } from "~/gql/types";

import { useMap } from "~/components/map.context";

import { SearchHeader } from "./components/search-header";
import { LocationItem } from "./components/location-item";
import { SportFilters } from "./components/sport-filters";

function SearchEmptyComponent({
  searchQuery,
  loading,
  error,
  hasFilters,
}: {
  searchQuery: string;
  loading: boolean;
  error: Error | undefined;
  hasFilters: boolean;
}) {
  // Show welcome message when no search query or filters
  if (!searchQuery.trim() && !hasFilters) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-muted-foreground text-center text-lg">
          Search for locations or select a sport to get started
        </Text>
      </View>
    );
  }

  // No search query entered yet
  if (!searchQuery.trim()) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-muted-foreground text-center">
          Start typing to search for locations
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-muted-foreground text-center mb-4">
          Unable to search locations. Please try again.
        </Text>
      </View>
    );
  }

  // Loading state (when no results yet)
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ActivityIndicator size="large" className="text-primary mb-4" />
        <Text className="text-muted-foreground text-center">
          {`Searching for "${searchQuery}"...`}
        </Text>
      </View>
    );
  }

  // No results found
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-foreground font-semibold text-lg mb-2">
        No results found
      </Text>
      <Text className="text-muted-foreground text-center mb-4">
        {`We couldn't find any locations matching "${searchQuery}" in this area.`}
      </Text>
      <Text className="text-muted-foreground text-center mb-4">
        Try adjusting your search or zoom out on the map.
      </Text>
    </View>
  );
}

export function Component() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { currentRegion, setMarkers } = useMap();
  const isFocused = useIsFocused();

  // Algolia hooks
  const { query, refine: refineQuery } = useSearchBox();
  const {
    items: searchResults,
    sendEvent,
    refine: refineGeoSearch,
  } = useGeoSearch();
  const { status } = useInstantSearch();

  // Get loading state from InstantSearch status (replacing deprecated isSearchStalled)
  const searchLoading = status === "loading" || status === "stalled";

  // Update geo bounds when region changes
  useEffect(() => {
    if (currentRegion) {
      const boundingBox = regionToBoundingBoxWithBuffer(currentRegion, 0.05);
      refineGeoSearch({
        northEast: {
          lat: boundingBox.northEast.latitude,
          lng: boundingBox.northEast.longitude,
        },
        southWest: {
          lat: boundingBox.southWest.latitude,
          lng: boundingBox.southWest.longitude,
        },
      });
    }
  }, [currentRegion]);

  // Update map markers when search results change
  useEffect(() => {
    if (!isFocused) return;

    const markers = searchResults.map((location: any) => ({
      id: location.objectID,
      geo: { latitude: location._geoloc.lat, longitude: location._geoloc.lng },
      displayType: "location" as const,
    }));
    setMarkers(markers);
  }, [searchResults, isFocused, setMarkers]);

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    refineQuery(searchQuery);
  };

  return (
    <View className="flex-1">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
      />

      <BottomSheetFlatList
        className="border-t border-border bg-muted"
        contentContainerClassName="pt-4 pb-safe-offset-4"
        data={searchResults}
        keyExtractor={(item: any) => item.objectID}
        renderItem={({ item }) => <LocationItem location={item as any} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<SportFilters />}
        ListEmptyComponent={
          <SearchEmptyComponent
            searchQuery={searchQuery}
            loading={searchLoading}
            error={undefined}
            hasFilters={false} // Filters are now managed by Algolia
          />
        }
        refreshing={searchLoading && searchResults.length > 0}
        onRefresh={() => {
          // Trigger a re-search by refining with current parameters
          if (currentRegion) {
            const boundingBox = regionToBoundingBoxWithBuffer(
              currentRegion,
              0.05,
            );
            refineGeoSearch({
              northEast: {
                lat: boundingBox.northEast.latitude,
                lng: boundingBox.northEast.longitude,
              },
              southWest: {
                lat: boundingBox.southWest.latitude,
                lng: boundingBox.southWest.longitude,
              },
            });
          }
        }}
      />
    </View>
  );
}

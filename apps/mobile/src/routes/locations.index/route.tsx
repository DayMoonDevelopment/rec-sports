import { View, Text, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";
import { useBottomSheet, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";

import { Sport } from "~/gql/types";

import { useMap } from "~/components/map.context";

import { SearchHeader } from "./components/search-header";
import { LocationItem } from "./components/location-item";
import { SportFilters } from "./components/sport-filters";

import { GetSearchLocationsDocument } from "./queries/get-search-locations.generated";

import type { ApolloError } from "@apollo/client";

function SearchEmptyComponent({
  searchQuery,
  loading,
  error,
  hasFilters,
}: {
  searchQuery: string;
  loading: boolean;
  error: ApolloError | undefined;
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
  const [sportFilters, setSportFilters] = useState<Sport[]>([]);

  const { currentRegion, setMarkers } = useMap();
  const isFocused = useIsFocused();

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery(GetSearchLocationsDocument, {
    variables: {
      requiredSports: sportFilters,
      query: searchQuery || "", // Provide empty string when no search query but have sport filters
      region: currentRegion
        ? {
            boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 0.05), // Add buffer
          }
        : undefined,
      first: 25,
    },
    onCompleted: (data) => {
      // Only manipulate map if route is focused
      if (!isFocused) return;

      const locations = data?.locations.edges?.map((edge) => edge.node) || [];
      const markers = locations.map((location) => ({
        id: location.id,
        geo: location.geo,
        displayType: "location" as const,
      }));
      setMarkers(markers);
    },
  });

  const searchResults =
    searchData?.locations.edges?.map((edge) => edge.node) || [];

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSportFilterChange = (sport: Sport) => {
    setSportFilters((existingSports) => {
      if (existingSports.includes(sport)) {
        return existingSports.filter((s) => s !== sport);
      }
      return [...existingSports, sport];
    });
  };

  return (
    <View className="flex-1">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        sportFilters={sportFilters}
        onSportFilterChange={handleSportFilterChange}
      />

      <BottomSheetFlatList
        className="border-t border-border bg-muted"
        contentContainerClassName="pt-4 pb-safe-offset-4"
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LocationItem location={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          sportFilters.length > 0 ? null : (
            <SportFilters onSportFilterChange={handleSportFilterChange} />
          )
        }
        ListEmptyComponent={
          <SearchEmptyComponent
            searchQuery={searchQuery}
            loading={searchLoading}
            error={searchError}
            hasFilters={sportFilters.length > 0}
          />
        }
        refreshing={searchLoading && searchResults.length > 0}
        onRefresh={refetchSearch}
      />
    </View>
  );
}

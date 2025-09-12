import { View } from "react-native";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";

import { SearchHeader } from "./_search-header";
import { Feed } from "./_feed";
import { SearchFeed } from "./_search-feed";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";
import { GetSearchLocationsDocument } from "./queries/get-search-locations.generated";

export function Component() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  const { currentRegion, setMarkers } = useMap();
  const isFocused = useIsFocused();

  // Query for search locations
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery(GetSearchLocationsDocument, {
    variables: {
      query: searchQuery,
      region: currentRegion
        ? {
            boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 0.05), // Add buffer
          }
        : undefined,
      first: 100,
    },
    skip: !isFocused, // Skip query if route is not focused or no search query
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

  const handleSearchModeChange = (searchMode: boolean) => {
    setIsSearchMode(searchMode);

    // Update map with appropriate data when mode changes, but only if route is focused
    if (
      isFocused &&
      searchMode &&
      searchQuery.trim() &&
      searchResults.length > 0
    ) {
      const markers = searchResults.map((location) => ({
        id: location.id,
        geo: location.geo,
        displayType: "location" as const,
      }));
      setMarkers(markers);
    }
  };

  return (
    <View className="flex-1">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        isSearchMode={isSearchMode}
        onSearchModeChange={handleSearchModeChange}
      />
      {isSearchMode ? (
        <SearchFeed
          searchQuery={searchQuery}
          searchResults={searchResults}
          loading={searchLoading}
          error={searchError}
          onRefetch={refetchSearch}
        />
      ) : (
        <Feed />
      )}
    </View>
  );
}

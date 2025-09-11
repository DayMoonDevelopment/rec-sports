import { View } from "react-native";
import { useState } from "react";
import { useQuery } from "@apollo/client";

import { SearchHeader } from "./_search-header";
import { Feed } from "./_feed";
import { SearchFeed } from "./_search-feed";
import { useMap } from "~/components/map.context";
import { regionToBoundingBoxWithBuffer } from "~/lib/region-utils";
import { GetSearchLocationsDocument } from "./queries/get-search-locations.generated";

export function Component() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  const { currentRegion, setLocations } = useMap();

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
            boundingBox: regionToBoundingBoxWithBuffer(currentRegion, 0.1), // Add buffer
          }
        : undefined,
      first: 100,
    },
    onCompleted: (data) => {
      const locations = data?.locations.edges?.map((edge) => edge.node) || [];
      setLocations(locations);
    },
  });

  const searchResults =
    searchData?.locations.edges?.map((edge) => edge.node) || [];

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchModeChange = (searchMode: boolean) => {
    setIsSearchMode(searchMode);

    // Update map with appropriate data when mode changes
    if (searchMode && searchQuery.trim() && searchResults.length > 0) {
      setLocations(searchResults);
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

import { View } from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import { useState } from "react";

import { SearchHeader } from "./_search-header";
import { SearchResultsItem } from "./_search-results-item";
import { EmptySearchState } from "./_empty-search-state";
import { NoResultsState } from "./_no-results-state";
import { SuggestedLocations } from "./_suggested-locations";

import type { Location } from "@rec/types";

function VerticalItemSeparatorComponent() {
  return <View className="h-2" />;
}

function renderContent(
  isInputFocused: boolean,
  hasSearchTerm: boolean,
  searchItems: Location[],
  query: string,
) {
  // State 1: Input not focused with no search term
  if (!isInputFocused && !hasSearchTerm) {
    return (
      <BottomSheetScrollView className="px-4">
        <SuggestedLocations hasSearchTerm={hasSearchTerm} />
      </BottomSheetScrollView>
    );
  }

  // State 2: Input not focused with search term (show results)
  if (!isInputFocused && hasSearchTerm) {
    return (
      <BottomSheetFlashList
        estimatedItemSize={100}
        data={searchItems}
        renderItem={({ item }: { item: Location }) => (
          <SearchResultsItem location={item} />
        )}
        keyExtractor={(item: Location) => item.objectID}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={<NoResultsState query={query} />}
      />
    );
  }

  // State 3: Input focused with no search term
  if (isInputFocused && !hasSearchTerm) {
    return (
      <BottomSheetScrollView className="px-4">
        <EmptySearchState />
      </BottomSheetScrollView>
    );
  }

  // State 4: Input focused with search term and results
  // State 5: Input focused with search term but no results
  return (
    <BottomSheetFlashList
      estimatedItemSize={100}
      data={searchItems}
      renderItem={({ item }: { item: Location }) => (
        <SearchResultsItem location={item} />
      )}
      keyExtractor={(item: Location) => item.objectID}
      ItemSeparatorComponent={VerticalItemSeparatorComponent}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      ListEmptyComponent={<NoResultsState query={query} />}
    />
  );
}

export function Component() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [query, setQuery] = useState("");

  // Static placeholder - empty array for now
  const searchItems: Location[] = [];

  // Determine current state
  const hasSearchTerm = query?.trim().length > 0;

  const handleFocusChange = (focused: boolean) => {
    setIsInputFocused(focused);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <View className="flex-1">
      <SearchHeader
        onFocusChange={handleFocusChange}
        query={query}
        onQueryChange={handleQueryChange}
      />
      {renderContent(isInputFocused, hasSearchTerm, searchItems, query)}
    </View>
  );
}

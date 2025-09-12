import { View, Text, ActivityIndicator } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { ApolloError } from "@apollo/client";

import { LocationItem } from "./_location-item";

import type { LocationNodeFragment } from "./queries/get-search-locations.generated";

interface SearchFeedProps {
  searchQuery: string;
  searchResults: LocationNodeFragment[];
  loading: boolean;
  error: ApolloError | undefined;
  onRefetch: () => void;
}

function SearchEmptyComponent({
  searchQuery,
  loading,
  error,
}: {
  searchQuery: string;
  loading: boolean;
  error: ApolloError | undefined;
}) {
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

export function SearchFeed({
  searchQuery,
  searchResults,
  loading,
  error,
  onRefetch,
}: SearchFeedProps) {
  return (
    <BottomSheetFlatList
      className="border-t border-border bg-muted"
      contentContainerClassName="pt-4 pb-safe-offset-4"
      data={searchResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <LocationItem location={item} />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <SearchEmptyComponent
          searchQuery={searchQuery}
          loading={loading}
          error={error}
        />
      }
      refreshing={loading && searchResults.length > 0}
      onRefresh={onRefetch}
    />
  );
}

import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { ApolloError } from "@apollo/client";
import { Link } from "expo-router";

import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";

import type { LocationNodeFragment } from "./queries/get-search-locations.generated";

interface SearchFeedProps {
  searchQuery: string;
  searchResults: LocationNodeFragment[];
  loading: boolean;
  error: ApolloError | undefined;
  onRefetch: () => void;
}

interface SearchLocationItemProps {
  location: LocationNodeFragment;
}

function SearchLocationItem({ location }: SearchLocationItemProps) {
  return (
    <Link asChild href={`/locations/${location.id}`}>
      <Pressable className="mx-4 mb-3 active:opacity-75">
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
    </Link>
  );
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
      renderItem={({ item }) => <SearchLocationItem location={item} />}
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

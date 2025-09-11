import { View, Text, Pressable, TextInput } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";

import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { SearchInput } from "~/ui/search-input";
import { sportLabel } from "~/lib/utils";
import { GetSearchLocationsDocument } from "../queries/get-search-locations.generated";

import type { LocationNodeFragment } from "../queries/get-search-locations.generated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { remapProps } from "nativewind";

const StyledBottomSheet = remapProps(BottomSheet, {
  backgroundClass: "backgroundStyle",
});

export interface LocationSelectionBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface LocationSelectionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onLocationSelect: (location: LocationNodeFragment) => void;
}

interface SearchLocationItemProps {
  location: LocationNodeFragment;
  onPress: (location: LocationNodeFragment) => void;
}

interface EmptyStateProps {
  searchQuery: string;
  error: any;
}

function EmptySearchState() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-muted-foreground text-center">
        Start typing to search for locations
      </Text>
    </View>
  );
}

function ErrorState() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-muted-foreground text-center">
        Unable to search locations. Please try again.
      </Text>
    </View>
  );
}

function NoResultsState({ searchQuery }: { searchQuery: string }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-foreground font-semibold text-lg mb-2">
        No results found
      </Text>
      <Text className="text-muted-foreground text-center">
        We couldn't find any locations matching "{searchQuery}".
      </Text>
    </View>
  );
}

function EmptyStateComponent({ searchQuery, error }: EmptyStateProps) {
  if (!searchQuery.trim()) {
    return <EmptySearchState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return <NoResultsState searchQuery={searchQuery} />;
}

function SearchLocationItem({ location, onPress }: SearchLocationItemProps) {
  return (
    <Pressable
      className="mx-4 mb-1 active:opacity-75"
      onPress={() => onPress(location)}
    >
      <View className="bg-card border border-border rounded-3xl p-4">
        <View className="flex-row items-start gap-3">
          <View className="bg-green-100 dark:bg-green-800 p-2 rounded-xl">
            <TreeIcon className="size-6 text-green-700 dark:text-green-500" />
          </View>

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

export function LocationSelectionBottomSheet({
  bottomSheetRef,
  onLocationSelect,
}: LocationSelectionBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { top } = useSafeAreaInsets();

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchQuery]);

  const { data, loading, error } = useQuery(GetSearchLocationsDocument, {
    variables: {
      query: searchQuery,
      first: 20,
    },
  });

  const searchResults = data?.locations.edges?.map((edge) => edge.node) || [];
  const isRefreshing = loading && searchQuery.trim().length > 0;

  const handleLocationPress = useCallback(
    (location: LocationNodeFragment) => {
      onLocationSelect(location);
      bottomSheetRef.current?.close();
      setSearchQuery("");
      setInputValue("");
    },
    [onLocationSelect, bottomSheetRef],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: LocationNodeFragment }) => (
      <SearchLocationItem location={item} onPress={handleLocationPress} />
    ),
    [handleLocationPress],
  );

  const renderListEmpty = useCallback(
    () => <EmptyStateComponent searchQuery={searchQuery} error={error} />,
    [searchQuery, error],
  );

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["100%"]}
      enablePanDownToClose={true}
      topInset={top || 16}
      enableDynamicSizing={false}
      backgroundClass="bg-card"
    >
      <View className="flex-1">
        <View className="px-4 py-2 border-b border-border">
          <SearchInput
            ref={inputRef}
            value={inputValue}
            onChangeText={handleChangeText}
            onClear={handleClear}
            placeholder="Find a place to play..."
            useBottomSheetInput
          />
        </View>

        <BottomSheetFlatList
          className="pt-4 pb-safe-offset-12 bg-muted"
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderListEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: searchResults.length > 0 ? 0 : 12,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          refreshing={isRefreshing}
        />
      </View>
    </StyledBottomSheet>
  );
}

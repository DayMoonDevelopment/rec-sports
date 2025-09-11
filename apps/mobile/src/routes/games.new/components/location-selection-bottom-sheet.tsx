import { View, Text, Pressable, FlatList, ActivityIndicator } from "react-native";
import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";

import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { CrossIcon } from "~/icons/cross";
import { SearchIcon } from "~/icons/search";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";
import { GetSearchLocationsDocument } from "~/routes/(map).index/queries/get-search-locations.generated";

import type { LocationNodeFragment } from "~/routes/(map).index/queries/get-search-locations.generated";

export interface LocationSelectionBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface LocationSelectionBottomSheetProps {
  onLocationSelect: (location: LocationNodeFragment) => void;
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

export const LocationSelectionBottomSheet = forwardRef<
  LocationSelectionBottomSheetRef,
  LocationSelectionBottomSheetProps
>(({ onLocationSelect }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState("");

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetRef.current?.expand();
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    dismiss: () => {
      bottomSheetRef.current?.close();
      setSearchQuery("");
      setInputValue("");
    },
  }));

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchQuery]);

  const { data, loading, error } = useQuery(
    GetSearchLocationsDocument,
    {
      variables: {
        query: searchQuery,
        first: 20,
      },
      skip: !searchQuery.trim(),
    },
  );

  const searchResults = data?.locations.edges?.map((edge) => edge.node) || [];

  const handleLocationPress = useCallback((location: LocationNodeFragment) => {
    onLocationSelect(location);
    bottomSheetRef.current?.close();
    setSearchQuery("");
    setInputValue("");
  }, [onLocationSelect]);

  const handleCloseSearch = useCallback(() => {
    bottomSheetRef.current?.close();
    setSearchQuery("");
    setInputValue("");
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["75%", "100%"]}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: "transparent" }}
      handleIndicatorStyle={{ backgroundColor: "#666" }}
    >
      <BottomSheetView className="flex-1 bg-background">
        <View className="flex flex-row items-center gap-2 p-4 border-b border-border">
          <View className="flex-1 flex flex-row gap-1 items-center justify-start bg-card border border-border rounded-full px-4 h-14">
            <SearchIcon height={16} width={16} />
            <BottomSheetTextInput
              ref={inputRef}
              value={inputValue}
              placeholder="Find a place to play..."
              className="flex-1 text-foreground placeholder:text-muted-foreground"
              onChangeText={handleChangeText}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable
            className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50"
            onPress={handleCloseSearch}
          >
            <CrossIcon height={22} width={22} />
          </Pressable>
        </View>

        {!searchQuery.trim() ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-muted-foreground text-center">
              Start typing to search for locations
            </Text>
          </View>
        ) : loading && searchResults.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size="large" className="text-primary mb-4" />
            <Text className="text-muted-foreground text-center">
              {`Searching for "${searchQuery}"...`}
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-muted-foreground text-center">
              Unable to search locations. Please try again.
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-foreground font-semibold text-lg mb-2">
              No results found
            </Text>
            <Text className="text-muted-foreground text-center">
              We couldn't find any locations matching "{searchQuery}".
            </Text>
          </View>
        ) : (
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
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

LocationSelectionBottomSheet.displayName = "LocationSelectionBottomSheet";

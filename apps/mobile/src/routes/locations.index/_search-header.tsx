import { View, Pressable, TextInput } from "react-native";
import { useBottomSheet, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState, useRef, useEffect } from "react";

import { SearchIcon } from "~/icons/search";
import { CrossIcon } from "~/icons/cross";
import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";
import { Sport } from "~/gql/types";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isSearchMode: boolean;
  onSearchModeChange: (isSearchMode: boolean) => void;
  sportFilters: Sport[];
  onSportFilterChange: (sport: Sport) => void;
}

export function SearchHeader({
  searchQuery,
  onSearchQueryChange,
  onSearchModeChange,
  isSearchMode,
  sportFilters,
  onSportFilterChange,
}: SearchHeaderProps) {
  const inputRef = useRef<TextInput>(null);
  const { snapToIndex } = useBottomSheet();
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearchQueryChange(inputValue);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchQuery, onSearchQueryChange]);

  function handleBlur() {
    if (!searchQuery.trim()) {
      snapToIndex(0); // Return to original position
    }
  }

  function handleSubmit() {
    inputRef.current?.blur();
  }

  function handleClear() {
    inputRef.current?.clear();
    setInputValue("");
    onSearchQueryChange("");
  }

  function handleCancel() {
    inputRef.current?.blur();
    handleClear();
    onSearchModeChange(false);
    snapToIndex(0);
    sportFilters.forEach(onSportFilterChange);
  }

  function handleFocus() {
    onSearchModeChange(true);
    snapToIndex(1); // Expand bottom sheet
  }

  function handleChangeText(text: string) {
    setInputValue(text);
  }

  return (
    <View>
      <View className="flex flex-row items-center gap-2 p-4">
        <View className="flex-1 flex flex-row gap-1 items-center justify-start bg-card border border-border rounded-full px-4 h-14">
          <SearchIcon className="size-4" />
          <BottomSheetTextInput
            ref={inputRef}
            value={inputValue}
            placeholder="Find a place to play..."
            className="flex-1 text-foreground placeholder:text-muted-foreground"
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {inputValue?.length ? (
            <Pressable
              className="active:opacity-50 transition-opacity"
              hitSlop={4}
              onPress={handleClear}
            >
              <CrossIcon className="size-3 text-muted-foreground" />
            </Pressable>
          ) : null}
        </View>

        {isSearchMode ? (
          <Pressable
            className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
            onPress={handleCancel}
          >
            <CrossIcon className="size-6" />
          </Pressable>
        ) : null}
      </View>

      {sportFilters.length > 0 && (
        <View className="px-4 pb-4">
          {sportFilters.map((sport) => (
            <Badge key={sport} variant={sport}>
              <BadgeText>{sportLabel(sport)}</BadgeText>
              <Pressable onPress={() => onSportFilterChange(sport)} hitSlop={8}>
                <BadgeIcon Icon={CrossIcon} />
              </Pressable>
            </Badge>
          ))}
        </View>
      )}
    </View>
  );
}

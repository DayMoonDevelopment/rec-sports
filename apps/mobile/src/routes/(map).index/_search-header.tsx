import { Text, View, Pressable, TextInput } from "react-native";
import { useBottomSheet, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState, useRef, useEffect, useCallback } from "react";

import { SearchIcon } from "~/icons/search";
import { CrossSmallIcon } from "~/icons/cross-small";
import { useMap } from "~/components/map.context";
import { CrossIcon } from "../../icons/cross";

export function SearchHeader() {
  const inputRef = useRef<TextInput>(null);
  const { searchQuery, setSearchQuery, isSearchMode, setIsSearchMode } = useMap();
  const { snapToIndex } = useBottomSheet();
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  
  const isQuerying = searchQuery.trim().length > 0;

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchQuery, setSearchQuery]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    // Only exit search mode if there's no query
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      snapToIndex(0); // Return to original position
    }
  }, [searchQuery, setIsSearchMode, snapToIndex]);

  const handleSubmit = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  const handleClear = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
    setIsSearchMode(false);
    snapToIndex(0); // Return to original position
  }, [setSearchQuery, setIsSearchMode, snapToIndex]);

  const handleCancel = useCallback(() => {
    inputRef.current?.blur();
    handleClear();
  }, [handleClear]);

  const handleFocus = useCallback(async () => {
    setFocused(true);
    setIsSearchMode(true);
    snapToIndex(1); // Expand bottom sheet
  }, [setIsSearchMode, snapToIndex]);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  return (
    <View className="flex flex-row items-center gap-2 p-4">
      <View className="flex-1 flex flex-row gap-1 items-center justify-start bg-card border border-border rounded-full px-4 h-14">
        <SearchIcon height={16} width={16} />
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
        {isQuerying ? (
          <Pressable
            className="bg-secondary p-1 rounded-full active:opacity-50 transition-opacity"
            hitSlop={4}
            onPress={handleClear}
          >
            <CrossSmallIcon height={12} width={12} />
          </Pressable>
        ) : null}
      </View>

      {isQuerying || focused ? (
        <Pressable
          className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
          onPress={handleCancel}
        >
          <CrossIcon height={22} width={22} />
        </Pressable>
      ) : (
        <Pressable className="size-14 bg-primary rounded-full items-center justify-center active:opacity-50 transition-opacity">
          <Text className="text-primary-foreground font-semibold text-lg">
            RS
          </Text>
        </Pressable>
      )}
    </View>
  );
}

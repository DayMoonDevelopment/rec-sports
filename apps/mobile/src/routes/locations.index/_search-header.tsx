import { View, Pressable, TextInput } from "react-native";
import { useBottomSheet, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState, useRef, useEffect } from "react";

import { SearchIcon } from "~/icons/search";
import { CrossIcon } from "~/icons/cross";

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchMode: boolean;
  setIsSearchMode: (isSearchMode: boolean) => void;
}

export function SearchHeader({
  searchQuery,
  setSearchQuery,
  setIsSearchMode,
}: SearchHeaderProps) {
  const inputRef = useRef<TextInput>(null);
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

  function handleBlur() {
    setFocused(false);
    // Only exit search mode if there's no query
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      snapToIndex(0); // Return to original position
    }
  }

  function handleSubmit() {
    inputRef.current?.blur();
  }

  function handleClear() {
    setInputValue("");
    setSearchQuery("");
    setIsSearchMode(false);
  }

  function handleCancel() {
    inputRef.current?.blur();
    handleClear();
  }

  function handleFocus() {
    setFocused(true);
    setIsSearchMode(true);
    snapToIndex(1); // Expand bottom sheet
  }

  function handleChangeText(text: string) {
    setInputValue(text);
  }

  return (
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
        {inputValue ? (
          <Pressable
            className="active:opacity-50 transition-opacity"
            hitSlop={4}
            onPress={handleClear}
          >
            <CrossIcon className="size-3 text-muted-foreground" />
          </Pressable>
        ) : null}
      </View>

      {isQuerying || focused ? (
        <Pressable
          className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
          onPress={handleCancel}
        >
          <CrossIcon className="size-6" />
        </Pressable>
      ) : null}
    </View>
  );
}

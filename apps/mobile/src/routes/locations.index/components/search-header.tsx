import { View, Pressable, TextInput } from "react-native";
import { useBottomSheet, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState, useRef, useEffect } from "react";

import { SearchIcon } from "~/icons/search";
import { CrossIcon } from "~/icons/cross";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function SearchHeader({
  searchQuery,
  onSearchQueryChange,
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
    snapToIndex(0);
  }

  function handleFocus() {
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

        {searchQuery.trim().length > 0 ? (
          <Pressable
            className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
            onPress={handleCancel}
          >
            <CrossIcon className="size-6" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

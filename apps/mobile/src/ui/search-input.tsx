import { View, Pressable, TextInput } from "react-native";
import { forwardRef, useCallback } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { SearchIcon } from "~/icons/search";
import { CrossSmallIcon } from "~/icons/cross-small";
import { cn } from "~/lib/utils";

import type { TextInputProps } from "react-native";

interface SearchInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  useBottomSheetInput?: boolean;
}

export const SearchInput = forwardRef<TextInput, SearchInputProps>(
  (
    {
      value,
      onChangeText,
      onClear,
      placeholder = "Search...",
      className,
      containerClassName,
      useBottomSheetInput = false,
      ...props
    },
    ref,
  ) => {
    const hasValue = value.trim().length > 0;

    const handleClear = useCallback(() => {
      onChangeText("");
      onClear?.();
    }, [onChangeText, onClear]);

    const InputComponent = useBottomSheetInput
      ? BottomSheetTextInput
      : TextInput;

    return (
      <View
        className={cn(
          "flex flex-row gap-1 items-center justify-start bg-card border border-border rounded-full px-4 h-14",
          containerClassName,
        )}
      >
        <SearchIcon height={16} width={16} />
        <InputComponent
          ref={ref}
          value={value}
          placeholder={placeholder}
          className={cn(
            "flex-1 text-foreground placeholder:text-muted-foreground",
            className,
          )}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {hasValue && (
          <Pressable
            className="bg-secondary p-1 rounded-full active:opacity-50 transition-opacity"
            hitSlop={4}
            onPress={handleClear}
          >
            <CrossSmallIcon height={12} width={12} />
          </Pressable>
        )}
      </View>
    );
  },
);

SearchInput.displayName = "SearchInput";

import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { cssInterop, remapProps } from "nativewind";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-core";

import { MapProvider } from "~/components/map.context";

import { MapViewComponent } from "./_map-view";
import { BottomSheetHandle } from "./_bottom-sheet-handle";

import type { TextStyle, ViewStyle } from "react-native";

const searchClient = algoliasearch(
  process.env.EXPO_PUBLIC_ALGOLIA_APP_ID,
  process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY,
);
const searchIndex = process.env.EXPO_PUBLIC_ALGOLIA_INDEX_NAME;

const snapPoints = ["50%", "100%"];

const StyledBottomSheet = remapProps(BottomSheet, {
  backgroundClassName: "backgroundStyle",
});

interface StackProps extends React.ComponentProps<typeof Stack> {
  contentStyle?: ViewStyle;
  headerStyle?: TextStyle;
}

function StackImpl({ contentStyle, ...props }: StackProps) {
  return (
    <Stack
      {...props}
      screenOptions={{
        ...props.screenOptions,
        contentStyle,
        navigationBarColor: contentStyle?.backgroundColor?.toString(),
      }}
    />
  );
}

// Changing this requires reloading the app
const StyledStack = cssInterop(StackImpl, {
  contentClassName: "contentStyle",
});

export function Component() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top: topInset } = useSafeAreaInsets();

  return (
    <InstantSearch searchClient={searchClient} indexName={searchIndex}>
      <MapProvider>
        <MapViewComponent />

        <StyledBottomSheet
          ref={bottomSheetRef}
          index={0}
          enableDynamicSizing={false}
          snapPoints={snapPoints}
          topInset={topInset}
          enableBlurKeyboardOnGesture
          enablePanDownToClose={false}
          enableOverDrag={false}
          backgroundClassName="bg-background"
          handleComponent={BottomSheetHandle}
        >
          <StyledStack
            contentClassName="bg-background"
            screenOptions={{
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
        </StyledBottomSheet>
      </MapProvider>
    </InstantSearch>
  );
}

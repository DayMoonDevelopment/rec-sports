import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { cssInterop } from "nativewind";

import { MapProvider } from "~/components/map.context";
import { BottomSheetBackground } from "./_bottom-sheet-background";
import { MapViewComponent } from "./_map-view";

import type { TextStyle, ViewStyle } from "react-native";

const snapPoints = ["50%", "100%"];

export function Component() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top: topInset } = useSafeAreaInsets();

  return (
    <MapProvider>
      <GestureHandlerRootView className="flex-1">
        <MapViewComponent />

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          enableDynamicSizing={false}
          snapPoints={snapPoints}
          topInset={topInset}
          enableBlurKeyboardOnGesture
          enablePanDownToClose={false}
          backgroundComponent={BottomSheetBackground}
          enableOverDrag={false}
        >
          <StyledStack
            contentClassName="bg-background"
            screenOptions={{
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
        </BottomSheet>
      </GestureHandlerRootView>
    </MapProvider>
  );
}

interface StackProps extends React.ComponentProps<typeof Stack> {
  contentStyle?: ViewStyle;
  headerStyle?: TextStyle;
}

function StackImpl({ contentStyle, headerStyle, ...props }: StackProps) {
  return (
    <Stack
      {...props}
      screenOptions={{
        ...props.screenOptions,
        contentStyle,
        headerStyle: {
          backgroundColor: headerStyle?.backgroundColor?.toString(),
        },
        navigationBarColor: contentStyle?.backgroundColor?.toString(),
        headerTintColor: headerStyle?.color?.toString(),
      }}
    />
  );
}

// Changing this requires reloading the app
const StyledStack = cssInterop(StackImpl, {
  contentClassName: "contentStyle",
  headerClassName: "headerStyle",
});

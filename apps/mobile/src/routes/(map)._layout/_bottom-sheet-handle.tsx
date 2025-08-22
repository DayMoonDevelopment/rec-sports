import { View } from "react-native";

export function BottomSheetHandle() {
  return (
    <View className="bg-background flex items-center justify-center p-2 rounded-t-2xl">
      <View className="w-10 h-1 bg-foreground rounded-full opacity-20" />
    </View>
  );
}

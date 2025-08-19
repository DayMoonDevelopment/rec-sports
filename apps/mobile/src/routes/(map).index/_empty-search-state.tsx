import { View, Text } from "react-native";

export function EmptySearchState() {
  return (
    <View className="py-8 items-center">
      <Text className="text-muted-foreground text-center text-lg">
        Start typing to search for locations
      </Text>
      <Text className="text-muted-foreground text-center text-sm mt-1">
        Find courts, fields, and facilities near you
      </Text>
    </View>
  );
}
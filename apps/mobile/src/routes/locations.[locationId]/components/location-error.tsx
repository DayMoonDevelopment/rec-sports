import { View, Text } from "react-native";

interface LocationErrorProps {
  message?: string;
}

export function LocationError({
  message = "There was an error fetching the location"
}: LocationErrorProps) {
  return (
    <View className="flex-1 justify-center items-center py-8 px-4">
      <Text className="text-foreground text-lg font-medium">
        {message}
      </Text>
    </View>
  );
}

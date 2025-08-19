import { View, Text } from "react-native";

interface NoResultsStateProps {
  query: string;
}

export function NoResultsState({ query }: NoResultsStateProps) {
  return (
    <View className="py-8 items-center">
      <Text className="text-muted-foreground text-center">
        No locations found matching &ldquo;{query}&rdquo;
      </Text>
      <Text className="text-muted-foreground text-center text-sm mt-1">
        Try adjusting your search terms
      </Text>
    </View>
  );
}
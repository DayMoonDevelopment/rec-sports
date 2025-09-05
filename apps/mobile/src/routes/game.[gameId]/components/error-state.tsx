import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
}

export function ErrorState({
  title = "Game Not Found",
  subtitle,
}: ErrorStateProps) {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  return (
    <View>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500">
        {subtitle || `Game ${gameId}`}
      </Text>
    </View>
  );
}

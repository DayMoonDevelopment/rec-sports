import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
}

export function ErrorState({
  title = "Team Not Found",
  subtitle,
}: ErrorStateProps) {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  return (
    <View>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500">
        {subtitle || `Team ${teamId}`}
      </Text>
    </View>
  );
}

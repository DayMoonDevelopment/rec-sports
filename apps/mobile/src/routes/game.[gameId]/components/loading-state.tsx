import { View, Text, ActivityIndicator } from "react-native";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
}

export function LoadingState({ message = "Loading...", size = "small" }: LoadingStateProps) {
  return (
    <View className="flex-row items-center">
      <ActivityIndicator size={size} color="#6B7280" />
      <Text className="text-lg font-semibold text-gray-900 ml-2">{message}</Text>
    </View>
  );
}
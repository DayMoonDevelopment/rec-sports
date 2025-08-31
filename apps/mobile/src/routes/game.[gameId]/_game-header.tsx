import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Cross } from "~/icons/cross";

interface GameHeaderProps {
  gameId: string;
}

export function GameHeader({ gameId }: GameHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
      <View>
        <Text className="text-lg font-semibold text-gray-900">Live Game</Text>
        <Text className="text-sm text-gray-500">Game {gameId}</Text>
      </View>
      <Pressable 
        onPress={() => router.back()}
        className="p-2 rounded-full bg-gray-100"
      >
        <Cross className="w-5 h-5 text-gray-600" />
      </Pressable>
    </View>
  );
}
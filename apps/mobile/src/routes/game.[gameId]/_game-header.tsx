import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@apollo/client";
import { CrossIcon } from "~/icons/cross";
import { SportIcon } from "~/components/sport-icon";
import { GetGameDocument } from "./queries/get-game.generated";
import { Sport } from "~/gql/types";

interface GameHeaderProps {
  gameId: string;
}

export function GameHeader({ gameId }: GameHeaderProps) {
  const { data, loading } = useQuery(GetGameDocument, {
    variables: { id: gameId },
  });

  const game = data?.game;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <View className="flex-1">
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#6B7280" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">Loading...</Text>
          </View>
        ) : game ? (
          <View className="flex-row items-center">
            <SportIcon sport={game.sport.toUpperCase() as Sport} className="size-6 mr-2" />
            <View>
              <Text className="text-lg font-semibold text-gray-900 capitalize">
                {game.sport} Game
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-500 capitalize mr-2">
                  {game.gameState.replace('_', ' ')}
                </Text>
                {game.location && (
                  <Text className="text-sm text-gray-500">
                    • {game.location.name}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text className="text-lg font-semibold text-gray-900">Game Not Found</Text>
            <Text className="text-sm text-gray-500">Game {gameId}</Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => router.back()}
        className="p-2 rounded-full bg-gray-100"
      >
        <CrossIcon className="size-5 text-gray-600" />
      </Pressable>
    </View>
  );
}

import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { GetGameDocument } from "./queries/get-game.generated";
import { TeamType } from "~/gql/types";
import type { GameEventNodeFragment } from "./queries/get-game.generated";

interface GameEventsProps {
  gameId: string;
}

export function GameEvents({ gameId }: GameEventsProps) {
  const { data, loading } = useQuery(GetGameDocument, {
    variables: { id: gameId },
    pollInterval: 5000, // Poll for real-time updates
  });

  const game = data?.game;
  const events = game?.events || [];

  const formatEventTime = (occurredAt: unknown) => {
    const date = new Date(occurredAt as string);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatEventType = (eventType: string, eventKey?: string) => {
    if (eventKey) {
      return eventKey.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    return eventType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getTeamDisplayName = (team?: GameEventNodeFragment['team']) => {
    if (!team) return 'Unknown Team';
    return team.name || (team.teamType === TeamType.Individual ? 'Player' : 'Team');
  };

  const renderEvent = ({ item }: { item: GameEventNodeFragment }) => (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="font-medium text-gray-900">
          {formatEventType(item.eventType, item.eventKey || undefined)}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600">
            {getTeamDisplayName(item.team)}
          </Text>
          {item.periodName && (
            <Text className="text-sm text-gray-500 ml-2">
              • {item.periodName}
            </Text>
          )}
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-semibold ${
          item.points > 0 ? 'text-green-600' : 
          item.points < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {item.points > 0 ? '+' : ''}{item.points}
        </Text>
        <Text className="text-xs text-gray-500">
          {formatEventTime(item.occurredAt)}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-gray-500 text-center">
        {loading ? 'Loading events...' : 'No game events yet'}
      </Text>
      {loading && <ActivityIndicator size="small" color="#6B7280" className="mt-2" />}
    </View>
  );

  return (
    <View className="flex-1">
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-900">
          Game Events {events.length > 0 && `(${events.length})`}
        </Text>
      </View>
      
      {events.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={events.slice().reverse()} // Show newest events first
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
import { View, Text, FlatList } from "react-native";
import { useState } from "react";

interface GameEvent {
  id: string;
  team: string;
  player: string;
  action: string;
  points: number;
  time: string;
}

interface GameEventsProps {
  gameId: string;
}

export function GameEvents({ gameId }: GameEventsProps) {
  const [events] = useState<GameEvent[]>([
    { id: '1', team: 'Team Alpha', player: 'Player 1', action: 'Score', points: 2, time: '12:34' },
    { id: '2', team: 'Team Beta', player: 'Player 3', action: 'Three Pointer', points: 3, time: '11:45' },
    { id: '3', team: 'Team Alpha', player: 'Player 2', action: 'Free Throw', points: 1, time: '10:12' },
    { id: '4', team: 'Team Beta', player: 'Player 4', action: 'Penalty', points: -1, time: '09:33' },
  ]);

  const renderEvent = ({ item }: { item: GameEvent }) => (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="font-medium text-gray-900">{item.action}</Text>
        <Text className="text-sm text-gray-600">{item.team} • {item.player}</Text>
      </View>
      <View className="items-end">
        <Text className={`font-semibold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {item.points > 0 ? '+' : ''}{item.points}
        </Text>
        <Text className="text-xs text-gray-500">{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-900">Game Events</Text>
      </View>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
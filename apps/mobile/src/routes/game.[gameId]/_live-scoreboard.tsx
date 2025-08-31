import { View, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

interface LiveScoreboardProps {
  gameId: string;
}

export function LiveScoreboard({ gameId }: LiveScoreboardProps) {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // Mock auto-updating scores for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        if (Math.random() > 0.5) {
          setTeam1Score(prev => prev + 1);
        } else {
          setTeam2Score(prev => prev + 1);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="px-4 py-6 bg-gray-50">
      <View className="flex-row items-center justify-center mb-4">
        <View className={`flex-row items-center px-2 py-1 rounded-full ${isLive ? 'bg-green-100' : 'bg-gray-100'}`}>
          <View className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-500' : 'bg-gray-400'}`} />
          <Text className={`text-xs font-medium ${isLive ? 'text-green-700' : 'text-gray-600'}`}>
            {isLive ? 'LIVE' : 'CONNECTING...'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1 items-center">
          <Text className="text-lg font-medium text-gray-900 mb-1">Team Alpha</Text>
          <Text className="text-4xl font-bold text-blue-600">{team1Score}</Text>
        </View>
        
        <Text className="text-2xl font-light text-gray-400 mx-4">-</Text>
        
        <View className="flex-1 items-center">
          <Text className="text-lg font-medium text-gray-900 mb-1">Team Beta</Text>
          <Text className="text-4xl font-bold text-red-600">{team2Score}</Text>
        </View>
      </View>

      <View className="flex-row space-x-3">
        <Pressable 
          onPress={() => setTeam1Score(prev => prev + 1)}
          className="flex-1 py-3 px-4 bg-blue-500 rounded-lg"
        >
          <Text className="text-white text-center font-medium">+1 Alpha</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => setTeam2Score(prev => prev + 1)}
          className="flex-1 py-3 px-4 bg-red-500 rounded-lg"
        >
          <Text className="text-white text-center font-medium">+1 Beta</Text>
        </Pressable>
      </View>
    </View>
  );
}
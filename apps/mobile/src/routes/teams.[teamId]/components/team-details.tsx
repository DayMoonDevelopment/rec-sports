import { View, Text, FlatList } from "react-native";
import { useTeam } from "../use-team.hook";
import { LoadingState } from "./loading-state";
import { SportIcon } from "../../../components/sport-icon";
import { GameCard } from "./game-card";

export function TeamDetails() {
  const { data, loading, error } = useTeam({ fetchPolicy: "cache-first" });
  const team = data?.team;

  if (loading) {
    return (
      <View className="px-4 py-6 bg-muted">
        <View className="flex-row items-center justify-center">
          <LoadingState message="Loading team..." size="large" />
        </View>
      </View>
    );
  }

  if (error || (!loading && !team)) {
    return (
      <View className="px-4 py-6 bg-muted">
        <Text className="text-center text-muted-foreground">
          Team not found
        </Text>
      </View>
    );
  }

  if (!team) return null;

  const games = team.games?.edges?.map((edge) => edge.node) || [];

  console.log(games);

  return (
    <View className="bg-muted">
      <View className="flex flex-col gap-2 py-8">
        {/* Team Name Display */}
        <View className="flex flex-row items-center justify-center">
          <Text className="text-foreground text-5xl font-bold text-center">
            {team.name}
          </Text>
        </View>

        {/* Sport Icons */}
        <View className="flex flex-row items-center justify-center gap-2">
          {team.sports?.map((sport, index) => (
            <SportIcon key={index} sport={sport} />
          ))}
        </View>
      </View>

      {/* Games Section */}
      {games.length > 0 && (
        <View className="mb-6">
          <View className="px-4 mb-3">
            <Text className="text-foreground text-xl font-semibold">
              Recent Games
            </Text>
            <Text className="text-muted-foreground text-sm">
              {team.games?.totalCount || 0} games total
            </Text>
          </View>

          <FlatList
            data={games}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            renderItem={({ item }) => <GameCard game={item} />}
          />
        </View>
      )}
    </View>
  );
}

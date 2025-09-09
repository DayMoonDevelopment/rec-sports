import { View, Text, FlatList } from "react-native";
import { useTeam } from "../use-team.hook";
import { LoadingState } from "./loading-state";
import { SportIcon } from "../../../components/sport-icon";
import { GameCard } from "./game-card";
import { CloseButton } from "./close-button";

function ItemSeparatorComponent() {
  return <View className="w-2" />;
}

export function TeamDetails() {
  const { data, loading, error } = useTeam({ fetchPolicy: "cache-first" });
  const team = data?.team;

  return (
    <View className="bg-muted pt-safe-offset-8 pb-8 flex flex-col gap-8">
      <View className="flex flex-row gap-2 px-4">
        <View className="flex-1 flex flex-col gap-2">
          {loading ? (
            <LoadingState message="Loading team..." size="large" />
          ) : error || (!loading && !team) ? (
            <Text className="text-center text-muted-foreground">
              Team not found
            </Text>
          ) : team ? (
            <>
              {/* Team Name Display */}
              <Text className="text-foreground text-5xl font-bold">
                {team.name}
              </Text>

              {/* Sport Icons */}
              <View className="flex flex-row items-center justify-start gap-2">
                {team.sports?.map((sport, index) => (
                  <SportIcon key={index} sport={sport} />
                ))}
              </View>
            </>
          ) : null}
        </View>
        <CloseButton />
      </View>

      {/* Games Section - only show when team data is available */}
      {team && team.games?.edges?.length > 0 && (
        <FlatList
          data={team.games.edges.map((edge) => edge.node)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4"
          renderItem={({ item }) => <GameCard game={item} />}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      )}
    </View>
  );
}

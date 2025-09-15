import { Pressable, View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { cva } from "class-variance-authority";
import { useRefinementList } from "react-instantsearch-core";

import { Sport } from "~/gql/types";

import { SportIcon } from "~/components/sport-icon";
import { sportLabel } from "~/lib/utils";

const sportStyles = cva(
  "size-14 rounded-full flex justify-center items-center",
  {
    variants: {
      sport: {
        [Sport.Baseball]: "bg-sport-baseball",
        [Sport.Kickball]: "bg-sport-kickball",
        [Sport.Basketball]: "bg-sport-basketball",
        [Sport.Pickleball]: "bg-sport-pickleball",
        [Sport.Tennis]: "bg-sport-tennis",
        [Sport.Golf]: "bg-sport-golf",
        [Sport.DiscGolf]: "bg-sport-disc-golf",
        [Sport.Hockey]: "bg-sport-hockey",
        [Sport.Softball]: "bg-sport-softball",
        [Sport.Soccer]: "bg-sport-soccer",
        [Sport.Football]: "bg-sport-football",
        [Sport.Volleyball]: "bg-sport-volleyball",
        [Sport.Ultimate]: "bg-sport-ultimate",
      },
    },
  },
);

function ItemSeparatorComponent() {
  return <View className="size-4" />;
}

export function SportFilters() {
  // Use Algolia refinement list for the "sports" facet
  const { items, refine } = useRefinementList({
    attribute: "sports",
    limit: 100, // Ensure we get all available sports
    sortBy: ["count:desc", "name:asc"], // Sort by count descending, then name ascending
  });

  // Helper function to convert Algolia facet value back to Sport enum
  const facetValueToSport = (facetValue: string): Sport | null => {
    const sportValues = Object.values(Sport);
    return (
      sportValues.find((sport) => sport.toUpperCase() === facetValue) || null
    );
  };

  // Filter items to only include valid Sport enum values
  const validSportItems = items.filter((item) => {
    const sport = facetValueToSport(item.value);
    return sport !== null;
  });

  return (
    <FlatList
      contentContainerClassName="px-4 pb-4"
      horizontal
      showsHorizontalScrollIndicator={false}
      data={validSportItems}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => {
        const sport = facetValueToSport(item.value);
        if (!sport) return null;

        return (
          <Pressable
            onPress={() => refine(item.value)}
            className="w-18 flex flex-col gap-1 items-center opacity-100 active:opacity-50 transition-opacity"
          >
            <View
              className={`${sportStyles({ sport })} ${
                item.isRefined ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              <SportIcon sport={sport} className="text-white size-10" />
            </View>
            <Text className="text-sm text-center font-semibold text-foreground">
              {sportLabel(sport)}
            </Text>
          </Pressable>
        );
      }}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
}

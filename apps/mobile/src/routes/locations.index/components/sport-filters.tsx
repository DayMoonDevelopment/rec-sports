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

const sports = [
  {
    sport: Sport.Pickleball,
  },
  {
    sport: Sport.Basketball,
  },
  {
    sport: Sport.Soccer,
  },
  {
    sport: Sport.Tennis,
  },
  {
    sport: Sport.Baseball,
  },
  {
    sport: Sport.Softball,
  },
  {
    sport: Sport.Ultimate,
  },
  {
    sport: Sport.Football,
  },
  {
    sport: Sport.Hockey,
  },
];

export function SportFilters() {
  // Use Algolia refinement list for the "sports" facet
  const { items, refine } = useRefinementList({
    attribute: "sports",
  });

  // Helper function to convert Sport enum to uppercase string for Algolia facet
  const getSportFacetValue = (sport: Sport): string => {
    return sport.toUpperCase();
  };

  // Check if a sport is currently selected
  const isSportSelected = (sport: Sport): boolean => {
    const facetValue = getSportFacetValue(sport);
    return items.some((item) => item.value === facetValue && item.isRefined);
  };

  // Handle sport selection
  const handleSportPress = (sport: Sport) => {
    const facetValue = getSportFacetValue(sport);
    refine(facetValue);
  };

  return (
    <FlatList
      contentContainerClassName="px-4 pb-4"
      horizontal
      showsHorizontalScrollIndicator={false}
      data={sports}
      renderItem={({ item }) => {
        const isSelected = isSportSelected(item.sport);
        return (
          <Pressable
            onPress={() => handleSportPress(item.sport)}
            className="w-18 flex flex-col gap-1 items-center opacity-100 active:opacity-50 transition-opacity"
          >
            <View
              className={`${sportStyles({ sport: item.sport })} ${
                isSelected ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              <SportIcon sport={item.sport} className="text-white size-10" />
            </View>
            <Text className="text-sm text-center font-semibold text-foreground">
              {sportLabel(item.sport)}
            </Text>
          </Pressable>
        );
      }}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
}

import { Pressable, View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { cva } from "class-variance-authority";

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

interface SportFiltersProps {
  onSportFilterChange: (sport: Sport) => void;
}

export function SportFilters({ onSportFilterChange }: SportFiltersProps) {
  return (
    <FlatList
      contentContainerClassName="px-4"
      horizontal
      showsHorizontalScrollIndicator={false}
      data={sports}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSportFilterChange(item.sport)}
          className="w-18 flex flex-col gap-1 items-center opacity-100 active:opacity-50 transition-opacity"
        >
          <View className={sportStyles({ sport: item.sport })}>
            <SportIcon sport={item.sport} className="text-white size-10" />
          </View>
          <Text className="text-sm text-center font-semibold text-foreground">
            {sportLabel(item.sport)}
          </Text>
        </Pressable>
      )}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
}

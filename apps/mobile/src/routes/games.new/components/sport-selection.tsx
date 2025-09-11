import { View, Text, Pressable } from "react-native";
import { cva } from "class-variance-authority";

import { Sport } from "~/gql/types";

import { sportLabel } from "~/lib/utils";

import { SportIcon } from "~/components/sport-icon";

import { useCreateGameForm } from "../create-game-context";

const cardStyles = cva(
  "rounded-2xl px-2 py-4 flex flex-col items-center justify-center gap-2 border-2 transition-colors",
  {
    variants: {
      selected: {
        true: "border-primary bg-card",
        false: "border-border bg-transparent",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

const SPORTS = [
  Sport.Basketball,
  Sport.Soccer,
  Sport.Football,
  Sport.Baseball,
  Sport.Softball,
  Sport.Pickleball,
  Sport.Tennis,
  Sport.Hockey,
  Sport.Ultimate,
  Sport.Kickball,
];

export function SportSelection() {
  const { selectedSport, setSelectedSport } = useCreateGameForm();

  return (
    <View className="flex-row flex-wrap -m-1">
      {SPORTS.map((sport) => (
        <View key={sport} className="p-1 w-1/3">
          <Pressable
            onPress={() => setSelectedSport(sport)}
            className={cardStyles({ selected: selectedSport === sport })}
          >
            <SportIcon sport={sport} className="size-8" />
            <Text className="text-center font-semibold">
              {sportLabel(sport)}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

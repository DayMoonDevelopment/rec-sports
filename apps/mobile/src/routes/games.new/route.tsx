import { View, ScrollView, Text } from "react-native";
import { CreateGameProvider } from "./create-game-context";
import { SportSelection } from "./components/sport-selection";
import { LocationInput } from "./components/location-input";
import { DateTimeInput } from "./components/date-time-input";
import { TeamManagement } from "./components/team-management";
import { CreateGameButton } from "./components/create-game-button";

export function Component() {
  return (
    <CreateGameProvider>
      <View className="bg-background flex-1 pb-safe-offset-4">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pt-safe-offset-4 flex flex-col gap-8 px-4 pb-4"
        >
          <Text className="text-4xl font-bold text-foreground">
            Start a new game
          </Text>

          <SportSelection />

          <TeamManagement />

          {/*<LocationInput />*/}
          <DateTimeInput />
        </ScrollView>

        <CreateGameButton />
      </View>
    </CreateGameProvider>
  );
}

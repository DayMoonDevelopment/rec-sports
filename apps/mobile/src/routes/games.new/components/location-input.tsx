import { View, Text, TextInput } from "react-native";
import { useCreateGameForm } from "../create-game-context";

export function LocationInput() {
  const { selectedSport, locationName, setLocationName } = useCreateGameForm();

  if (!selectedSport) return null;

  return (
    <View className="space-y-3">
      <Text className="text-lg font-semibold text-foreground">
        Location
      </Text>
      <TextInput
        value={locationName}
        onChangeText={setLocationName}
        placeholder="Enter location name"
        className="p-3 bg-card border border-muted rounded-lg text-foreground"
        placeholderTextColor="#9CA3AF"
      />
      <Text className="text-sm text-muted-foreground">
        Location search integration coming soon
      </Text>
    </View>
  );
}

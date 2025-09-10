import { View, Text, TextInput } from "react-native";
import { useCreateGameForm } from "../create-game-context";

export function DateTimeInput() {
  const { selectedSport, scheduledDate, setScheduledDate } = useCreateGameForm();

  if (!selectedSport) return null;

  return (
    <View className="space-y-3">
      <Text className="text-lg font-semibold text-foreground">
        Scheduled Date
      </Text>
      <TextInput
        value={scheduledDate}
        onChangeText={setScheduledDate}
        placeholder="YYYY-MM-DD HH:mm (e.g., 2024-12-25 15:30)"
        className="p-3 bg-card border border-muted rounded-lg text-foreground"
        placeholderTextColor="#9CA3AF"
      />
      <Text className="text-sm text-muted-foreground">
        Date/time picker integration coming soon
      </Text>
    </View>
  );
}

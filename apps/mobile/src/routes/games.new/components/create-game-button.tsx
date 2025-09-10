import { View, Text, TouchableOpacity, Alert } from "react-native";

import { cn } from "~/lib/utils";

import { Button, ButtonText } from "~/ui/button";

import { useCreateGameForm } from "../create-game-context";
import { useCreateGame } from "../use-create-game.hook";

export function CreateGameButton() {
  const {
    selectedSport,
    selectedTeams,
    locationName,
    scheduledDate,
    canCreateGame,
    isScheduleEnabled,
  } = useCreateGameForm();
  const { createGame, loading, error } = useCreateGame();

  const handleCreateGame = async () => {
    if (!canCreateGame || !selectedSport) return;

    try {
      // For now, using a placeholder location ID since we don't have location selection implemented
      // In a real app, you'd have location search/selection
      const mockLocationId = undefined;

      await createGame({
        sport: selectedSport,
        teamIds: selectedTeams.map((t) => t.id),
        locationId: mockLocationId,
        scheduledAt: isScheduleEnabled
          ? scheduledDate.toISOString()
          : undefined,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to create game. Please try again.");
    }
  };

  return (
    <View className="felx flex-col gap-4 px-4">
      {/* Error Display */}
      {error && (
        <View className="p-3 bg-destructive/10 border border-destructive rounded-lg">
          <Text className="text-destructive">
            {error.message || "An error occurred while creating the game"}
          </Text>
        </View>
      )}

      {/* Create Game Button */}
      <Button onPress={handleCreateGame} disabled={!canCreateGame || loading}>
        <ButtonText>Create Game</ButtonText>
      </Button>
    </View>
  );
}

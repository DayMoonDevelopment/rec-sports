/**
 * DateTimeInput component for Android platform per https://github.com/react-native-datetimepicker/datetimepicker?tab=readme-ov-file#android-imperative-api
 */
import { View, Text, Switch } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useCreateGameForm } from "../create-game-context";
import { Button, ButtonText } from "~/ui/button";

export function DateTimeInput() {
  const {
    scheduledDate,
    setScheduledDate,
    isScheduleEnabled,
    setIsScheduleEnabled,
  } = useCreateGameForm();

  const handleDatePress = () => {
    if (!isScheduleEnabled) return;

    DateTimePickerAndroid.open({
      value: scheduledDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setScheduledDate(selectedDate);
        }
      },
      mode: "date",
      is24Hour: true,
      minimumDate: new Date(),
    });
  };

  const handleTimePress = () => {
    if (!isScheduleEnabled) return;

    DateTimePickerAndroid.open({
      value: scheduledDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setScheduledDate(selectedDate);
        }
      },
      mode: "time",
      is24Hour: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View className="flex flex-col gap-1">
      <Text className="text-lg font-semibold text-foreground pl-1">
        Schedule a time to play
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={handleDatePress}
            disabled={!isScheduleEnabled}
          >
            <ButtonText>{formatDate(scheduledDate)}</ButtonText>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onPress={handleTimePress}
            disabled={!isScheduleEnabled}
          >
            <ButtonText>{formatTime(scheduledDate)}</ButtonText>
          </Button>
        </View>

        <Switch
          value={isScheduleEnabled}
          onValueChange={setIsScheduleEnabled}
        />
      </View>
    </View>
  );
}

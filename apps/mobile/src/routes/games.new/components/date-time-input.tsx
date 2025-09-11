import { View, Text, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCreateGameForm } from "../create-game-context";

export function DateTimeInput() {
  const {
    scheduledDate,
    setScheduledDate,
    isScheduleEnabled,
    setIsScheduleEnabled,
  } = useCreateGameForm();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate && isScheduleEnabled) {
      setScheduledDate(selectedDate);
    }
  };

  return (
    <View className="flex flex-col gap-1">
      <Text className="text-lg font-semibold text-foreground pl-1">
        Schedule a time to play
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="-ml-3">
          <DateTimePicker
            value={scheduledDate}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
            disabled={!isScheduleEnabled}
            minimumDate={new Date()}
          />
        </View>

        <Switch
          value={isScheduleEnabled}
          onValueChange={setIsScheduleEnabled}
        />
      </View>
    </View>
  );
}

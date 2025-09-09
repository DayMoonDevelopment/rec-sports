import { View, Text } from "react-native";
import { UsersIcon } from "~/icons/users";
import { useTeam } from "../use-team.hook";

export function TeamTitle() {
  const { data } = useTeam();
  const team = data?.team;

  if (!team) return null;

  return (
    <View className="flex-row items-center">
      <UsersIcon className="size-6 mr-2 text-foreground" />
      <Text className="text-lg font-semibold text-foreground">{team.name}</Text>
    </View>
  );
}

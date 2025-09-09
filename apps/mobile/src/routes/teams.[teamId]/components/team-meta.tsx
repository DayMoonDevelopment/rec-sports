import { Text } from "react-native";
import { useTeam } from "../use-team.hook";

export function TeamMeta() {
  const { data } = useTeam({ fetchPolicy: "cache-only" });
  const team = data?.team;

  if (!team || !team.members) return null;

  const memberCount = team.members.length;
  const memberText = memberCount === 1 ? "player" : "members";

  return (
    <Text className="text-sm text-muted-foreground">
      {memberCount} {memberText}
    </Text>
  );
}

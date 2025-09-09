import { View } from "react-native";

import { useTeam } from "./use-team.hook";

import { TeamHeader } from "./components/team-header";
import { TeamDetails } from "./components/team-details";
import { TeamMembers } from "./components/team-members";

export function Component() {
  // load the team data into the cache from the network. use cache-first policies for components
  useTeam({
    fetchPolicy: "network-only",
  });

  return (
    <View className="flex-1 bg-background pt-safe">
      <TeamHeader />
      <TeamDetails />
      <TeamMembers />
    </View>
  );
}

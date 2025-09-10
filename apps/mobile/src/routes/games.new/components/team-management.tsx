import React from "react";
import { View, Text, Pressable } from "react-native";

import { UsersIcon } from "~/icons/users";
import { PlusSmallIcon } from "~/icons/plus-small";
import { CrossSmallIcon } from "~/icons/cross-small";

import { Button, ButtonIcon, ButtonText } from "~/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "~/ui/avatar";

import { useCreateGameForm } from "../create-game-context";
import type { SuggestedTeamsQuery } from "../queries/suggested-teams.generated";

type SelectedTeam = NonNullable<
  SuggestedTeamsQuery["suggestedTeams"]["edges"][0]["node"]
>;

export function TeamManagement() {
  const { selectedTeams, removeSelectedTeam, openTeamSelection } =
    useCreateGameForm();

  const getMemberText = (members: SelectedTeam["members"]) => {
    if (!members || members.length === 0) return "No members";
    if (members.length === 1)
      return members[0].firstName || members[0].displayName || "Unknown";
    if (members.length === 2) {
      const first = members[0].firstName || members[0].displayName || "Unknown";
      const second =
        members[1].firstName || members[1].displayName || "Unknown";
      return `${first} and ${second}`;
    }

    const first = members[0].firstName || members[0].displayName || "Unknown";
    const second = members[1].firstName || members[1].displayName || "Unknown";
    const othersCount = members.length - 2;
    const othersText = othersCount === 1 ? "other" : "others";
    return `${first}, ${second} and ${othersCount} ${othersText}`;
  };

  const renderSelectedTeam = (team: SelectedTeam) => {
    const members = team.members || [];
    const firstThreeMembers = members.slice(0, 3);

    return (
      <View
        key={team.id}
        className="flex-row items-center p-4 bg-card border border-border rounded-xl"
      >
        <View className="flex-1">
          <Text className="font-semibold text-foreground text-lg">
            {team.name}
          </Text>

          {members.length > 0 && (
            <View className="flex-row items-center gap-1">
              {/* Member Avatars */}
              <View className="flex-row gap-0 pl-3">
                {firstThreeMembers.map((member, index) => (
                  <Avatar
                    key={member.id}
                    className="size-8 border-2 border-background -ml-3"
                  >
                    <AvatarImage source={{ uri: member.photo?.source }} />
                    <AvatarFallback>
                      {member.firstName?.[0] || member.displayName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </View>

              {/* Member Text */}
              <Text className="text-sm text-muted-foreground flex-1">
                {getMemberText(members)}
              </Text>
            </View>
          )}
        </View>

        <Pressable onPress={() => removeSelectedTeam(team.id)} className="p-2">
          <CrossSmallIcon className="size-5 text-muted-foreground" />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      {selectedTeams.length === 0 ? (
        <View className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4">
          <UsersIcon className="text-muted-foreground size-16 opacity-75" />
          <Button onPress={openTeamSelection}>
            <ButtonIcon Icon={PlusSmallIcon} />
            <ButtonText>Add teams</ButtonText>
          </Button>
        </View>
      ) : (
        <View className="flex flex-col gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">
              Teams ({selectedTeams.length})
            </Text>
            <Button size="sm" onPress={openTeamSelection}>
              <ButtonIcon Icon={PlusSmallIcon} />
              <ButtonText className="text-primary-foreground font-medium">
                Add Team
              </ButtonText>
            </Button>
          </View>

          <View className="flex flex-col gap-3">
            {selectedTeams.map(renderSelectedTeam)}
          </View>
        </View>
      )}
    </>
  );
}

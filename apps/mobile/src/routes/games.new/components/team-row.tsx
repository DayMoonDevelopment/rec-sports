import React from "react";
import { View, Text, Pressable } from "react-native";

import { CheckIcon } from "~/icons/check";
import { Avatar, AvatarImage, AvatarFallback } from "~/ui/avatar";

import type { SuggestedTeamsQuery } from "../queries/suggested-teams.generated";

type Team = NonNullable<
  SuggestedTeamsQuery["suggestedTeams"]["edges"][0]["node"]
>;

interface TeamRowProps {
  team: Team;
  isSelected: boolean;
  onPress: (team: Team) => void;
}

export function TeamRow({ team, isSelected, onPress }: TeamRowProps) {
  const members = team.members || [];
  const firstThreeMembers = members.slice(0, 3);

  const getMemberText = () => {
    if (members.length === 0) return "No members";
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

  return (
    <Pressable
      onPress={() => onPress(team)}
      className={`flex-row items-center p-4 border-b border-border`}
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
              {getMemberText()}
            </Text>
          </View>
        )}
      </View>

      {isSelected ? (
        <View className="size-8 bg-primary rounded-full items-center justify-center">
          <CheckIcon className="size-4 text-primary-foreground" />
        </View>
      ) : null}
    </Pressable>
  );
}

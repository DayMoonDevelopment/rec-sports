import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

import { UsersIcon } from "~/icons/users";
import { TeamRow } from "./team-row";

import type { SuggestedTeamsQuery } from "../queries/suggested-teams.generated";

type Team = NonNullable<SuggestedTeamsQuery["suggestedTeams"]["edges"][0]["node"]>;

interface BottomSheetContentProps {
  teams: Team[];
  loading: boolean;
  error: any;
  selectedTeamIds: string[];
  onTeamPress: (team: Team) => void;
  onLoadMore: () => void;
}

export function BottomSheetContent({
  teams,
  loading,
  error,
  selectedTeamIds,
  onTeamPress,
  onLoadMore,
}: BottomSheetContentProps) {
  const renderTeamItem = ({ item }: { item: Team }) => (
    <TeamRow
      team={item}
      isSelected={selectedTeamIds.includes(item.id)}
      onPress={onTeamPress}
    />
  );

  if (loading && teams.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">Loading teams...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-destructive text-center">
          Failed to load teams. Please try again.
        </Text>
      </View>
    );
  }

  if (teams.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <UsersIcon className="size-16 text-muted-foreground opacity-50" />
        <Text className="text-lg font-semibold text-foreground mt-4">
          No teams available
        </Text>
        <Text className="text-muted-foreground text-center mt-2">
          Create your own teams to get started with games.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={teams}
      keyExtractor={(item) => item.id}
      renderItem={renderTeamItem}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        loading ? (
          <View className="py-4 items-center">
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}

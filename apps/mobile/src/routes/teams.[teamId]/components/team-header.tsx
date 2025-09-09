import { View } from "react-native";

import { useTeam } from "../use-team.hook";

import { TeamTitle } from "./team-title";
import { TeamMeta } from "./team-meta";
import { CloseButton } from "./close-button";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";

export function TeamHeader() {
  const { data, loading, error } = useTeam({
    fetchPolicy: "cache-first",
  });

  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
      <View className="flex-1">
        {loading ? (
          <LoadingState />
        ) : data?.team ? (
          <View>
            <TeamTitle />
            <TeamMeta />
          </View>
        ) : error ? (
          <ErrorState />
        ) : (
          <LoadingState />
        )}
      </View>
      <CloseButton />
    </View>
  );
}

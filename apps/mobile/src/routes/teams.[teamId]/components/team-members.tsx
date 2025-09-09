import { View, Text, FlatList } from "react-native";
import { useTeam } from "../use-team.hook";
import { MemberItem } from "./member-item";
import type { TeamMemberNodeFragment } from "../queries/get-team.generated";

function ItemSeparatorComponent() {
  return <View className="ml-20 h-px w-full bg-border" />;
}

const renderMember = ({ item }: { item: TeamMemberNodeFragment }) => (
  <MemberItem member={item} />
);

export function TeamMembers() {
  const { data } = useTeam({ fetchPolicy: "cache-first" });
  const team = data?.team;
  const members = team?.members || [];

  if (!team) return null;

  return (
    <View className="flex-1">
      {/* Section Header */}
      <View className="px-4 py-3 bg-background border-b border-border">
        <Text className="text-lg font-semibold text-foreground">Players</Text>
      </View>

      {/* Members List */}
      {members.length > 0 ? (
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          className="flex-1 bg-background"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-safe"
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-background">
          <Text className="text-muted-foreground text-center">
            No members in this team
          </Text>
        </View>
      )}
    </View>
  );
}

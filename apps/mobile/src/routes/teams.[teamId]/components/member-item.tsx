import { View, Text } from "react-native";
import { Avatar, AvatarImage, AvatarFallback } from "~/ui/avatar";
import type { TeamMemberNodeFragment } from "../queries/get-team.generated";

function getUserInitials(user: TeamMemberNodeFragment) {
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const displayName = user.displayName || "";

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (displayName) {
    const parts = displayName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName[0].toUpperCase();
  }

  return "?";
}

function getUserDisplayName(user: TeamMemberNodeFragment) {
  if (user.displayName) return user.displayName;
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  return "Unknown Member";
}

interface MemberItemProps {
  member: TeamMemberNodeFragment;
}

export function MemberItem({ member }: MemberItemProps) {
  return (
    <View className="flex-row items-center px-4 py-4 gap-2">
      {/* User Avatar */}
      <Avatar className="size-14">
        {member.photo?.source && (
          <AvatarImage source={{ uri: member.photo.source }} />
        )}
        <AvatarFallback className="text-2xl">
          {getUserInitials(member)}
        </AvatarFallback>
      </Avatar>

      <Text
        className="flex-1 font-medium text-foreground text-2xl"
        numberOfLines={1}
      >
        {getUserDisplayName(member)}
      </Text>
    </View>
  );
}

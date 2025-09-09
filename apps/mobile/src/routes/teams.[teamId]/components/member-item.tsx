import { View, Text } from "react-native";
import { useMutation } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import ContextMenu from "react-native-context-menu-view";

import { Avatar, AvatarImage, AvatarFallback } from "~/ui/avatar";
import { useConfirmation } from "~/hooks/use-confirmation";
import type { TeamMemberNodeFragment } from "../queries/get-team.generated";
import { RemoveMemberDocument } from "../mutations/remove-member.generated";

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
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const { confirm } = useConfirmation();

  const [removeMember] = useMutation(RemoveMemberDocument);

  const handleRemoveMember = async () => {
    const confirmed = await confirm({
      title: "Remove Member",
      message: `Are you sure you want to remove ${getUserDisplayName(member)} from the team?`,
      confirmText: "Remove",
      cancelText: "Cancel",
    });

    if (confirmed && teamId) {
      try {
        await removeMember({
          variables: {
            input: {
              userId: member.id,
              teamId: teamId,
            },
          },
        });
      } catch (error) {
        console.error("Failed to remove member:", error);
      }
    }
  };

  return (
    <ContextMenu
      actions={[{ title: "Remove from Team", destructive: true }]}
      onPress={(e) => {
        if (e.nativeEvent.index === 0) {
          handleRemoveMember();
        }
      }}
    >
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
    </ContextMenu>
  );
}

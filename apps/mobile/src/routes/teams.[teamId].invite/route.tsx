import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useMutation } from "@apollo/client";
import { CrossIcon } from "~/icons/cross";
import { AddMemberDocument } from "./mutations/add-member.generated";
import { Button, ButtonText } from "~/ui/button";
import { cn } from "~/lib/utils";

function CloseButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      className="p-3 rounded-full bg-secondary active:bg-muted transition-colors"
    >
      <CrossIcon className="size-5 text-muted-foreground" />
    </Pressable>
  );
}

export function Component() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [addMember] = useMutation(AddMemberDocument);

  const handleInviteCodeChange = (text: string) => {
    // Auto-uppercase for consistency
    const formattedText = text.toUpperCase();
    setInviteCode(formattedText);
  };

  const handleAddMember = async () => {
    if (!inviteCode.trim() || inviteCode.length !== 9 || !teamId) return;

    setIsLoading(true);
    try {
      await addMember({
        variables: {
          input: {
            userInviteCode: inviteCode.trim().toUpperCase(),
            teamId: teamId,
          },
        },
      });

      // Success - go back to team screen
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to add player",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-6 pt-safe-offset-6">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-12">
          <View className="flex-1 pr-4">
            <Text className="text-4xl font-bold text-foreground mb-3 leading-tight">
              Add a player
            </Text>
            <Text className="text-base text-muted-foreground leading-relaxed">
              Enter the invite code for the new player you want to add. They can
              find this on their profile.
            </Text>
          </View>
          <CloseButton />
        </View>

        {/* Form */}
        <View className="flex-1 flex flex-col justify-between pb-safe-offset-4">
          <TextInput
            value={inviteCode}
            onChangeText={handleInviteCodeChange}
            placeholder={Array(9).fill("-").join("")}
            maxLength={9}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect={false}
            editable={!isLoading}
            accessibilityLabel="User invite code"
            textAlign="center"
            numberOfLines={1}
            className={cn(
              `text-2xl tracking-[8px] text-foreground border-b-2 py-4 px-5 placeholder:text-muted-foreground`,
              inviteCode.length > 0 ? "border-primary" : "border-border",
            )}
            returnKeyType="done"
          />

          <Button
            onPress={handleAddMember}
            disabled={inviteCode.length !== 9 || isLoading}
          >
            <ButtonText>Add to team</ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

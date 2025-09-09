import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@apollo/client";
import { OtpInput } from "react-native-otp-entry";
import { CrossIcon } from "~/icons/cross";
import { AddMemberDocument } from "../teams.[teamId]/mutations/add-member.generated";

function CloseButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      className="p-2 rounded-full bg-gray-100"
    >
      <CrossIcon className="size-5 text-gray-600" />
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
            userInviteCode: inviteCode.trim(),
            teamId: teamId,
          },
        },
      });

      // Success - go back to team screen
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to add member",
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
      <View className="flex-1 px-6 pt-safe-offset-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Add Team Member
            </Text>
            <Text className="text-muted-foreground">
              Enter the invite code for the member you want to add
            </Text>
          </View>
          <CloseButton />
        </View>

        {/* Form */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground mb-6 text-center">
            Invite Code
          </Text>

          <View className="mb-8">
            <OtpInput
              numberOfDigits={9}
              onTextChange={handleInviteCodeChange}
              onFilled={handleAddMember}
              blurOnFilled
              autoFocus
              disabled={isLoading}
              theme={{
                containerStyle: {
                  width: "100%",
                  justifyContent: "center",
                },
                inputsContainerStyle: {
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
                pinCodeContainerStyle: {
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  backgroundColor: "transparent",
                  width: 35,
                  height: 50,
                },
                pinCodeTextStyle: {
                  fontSize: 18,
                  fontFamily: "monospace",
                  fontWeight: "600",
                  textTransform: "uppercase",
                },
                focusStickStyle: {
                  backgroundColor: "#3b82f6",
                },
                focusedPinCodeContainerStyle: {
                  borderColor: "#3b82f6",
                  borderWidth: 2,
                },
              }}
            />
          </View>

          {/* Action Button */}
          <Pressable
            onPress={handleAddMember}
            disabled={inviteCode.length !== 9 || isLoading}
            className="py-4 px-6 rounded-lg bg-primary active:opacity-70 disabled:opacity-50"
          >
            <Text className="text-center font-semibold text-lg text-primary-foreground">
              {isLoading ? "Adding Member..." : "Add Member"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

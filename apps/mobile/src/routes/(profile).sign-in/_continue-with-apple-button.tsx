import { useState } from "react";
import { Platform } from "react-native";
import { useMutation } from "@apollo/client";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

import { setUserToken } from "~/context/user";

import { AppleIcon } from "~/icons/apple";
import { Button, ButtonIcon, ButtonText } from "~/ui/button";

import { SignInWithAppleDocument } from "./mutations/sign-in-with-apple.generated";

export function ContinueWithAppleButton() {
  const [nativeModuleLoading, setNativeModuleLoading] = useState(false);
  const [signInWithApple, { loading }] = useMutation(
    SignInWithAppleDocument,
    {
      onCompleted: (data) => {
        if (data.signInWithApple.session) {
          setUserToken(data.signInWithApple.session.accessToken);
        }
        setNativeModuleLoading(false);
      },
      onError: (error) => {
        console.error(error);
        setNativeModuleLoading(false);
      },
    },
  );
  const isLoading = loading || nativeModuleLoading;

  if (Platform.OS !== "ios") {
    return null;
  }

  const handleAppleSignIn = async () => {
    setNativeModuleLoading(true);

    try {
      const nonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(),
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      });

      if (result.identityToken) {
        signInWithApple({
          variables: {
            input: {
              identityToken: result.identityToken,
              nonce,
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
      setNativeModuleLoading(false);
    }
  };

  return (
    <Button
      variant="brand-apple"
      onPress={handleAppleSignIn}
      disabled={isLoading}
    >
      <ButtonIcon Icon={AppleIcon} />
      <ButtonText>
        {isLoading ? "Signing in..." : "Continue with Apple"}
      </ButtonText>
    </Button>
  );
}

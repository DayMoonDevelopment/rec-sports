import { useState } from "react";
import { useMutation } from "@apollo/client";

import { setUserToken } from "~/context/user";

import { GoogleIcon } from "~/icons/google";

import { Button, ButtonIcon, ButtonText } from "~/ui/button";

import GoogleAuthModule from "@rec/expo-google-auth";

import { SignInWithGoogleDocument } from "./mutations/sign-in-with-google.generated";

export function ContinueWithGoogleButton() {
  const [nativeModuleLoading, setNativeModuleLoading] = useState(false);
  const [signInWithGoogle, { loading }] = useMutation(
    SignInWithGoogleDocument,
    {
      onCompleted: (data) => {
        if (data.signInWithGoogle.session) {
          setUserToken(data.signInWithGoogle.session.accessToken);
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

  const handleGoogleSignIn = async () => {
    setNativeModuleLoading(true);

    try {
      const result = await GoogleAuthModule.signInAsync();

      if (result.success && result.idToken && result.nonce) {
        signInWithGoogle({
          variables: {
            input: {
              idToken: result.idToken,
              nonce: result.nonce,
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
      variant="brand-google"
      onPress={handleGoogleSignIn}
      disabled={isLoading}
    >
      <ButtonIcon Icon={GoogleIcon} />
      <ButtonText>
        {isLoading ? "Signing in..." : "Continue with Google"}
      </ButtonText>
    </Button>
  );
}

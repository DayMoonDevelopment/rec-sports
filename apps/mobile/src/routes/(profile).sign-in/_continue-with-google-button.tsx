import { GoogleIcon } from "~/icons/google";
import { Button, ButtonIcon, ButtonText } from "~/ui/button";
import GoogleAuthModule from "../../../modules/google-auth";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_WEB!;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!;

export function ContinueWithGoogleButton() {
  const handleGoogleSignIn = async () => {
    console.log({ webClientId, iosClientId });
    try {
      // These values should come from your app's configuration
      const result = await GoogleAuthModule.signInAsync({
        webClientId,
        iosClientId,
      });

      if (result.success) {
        console.log("Google Sign-In successful:", result.idToken);
        // Handle successful sign-in (e.g., navigate to authenticated screen)
      }
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      // Handle sign-in error
    }
  };

  return (
    <Button variant="brand-google" onPress={handleGoogleSignIn}>
      <ButtonIcon Icon={GoogleIcon} />
      <ButtonText>Continue with Google</ButtonText>
    </Button>
  );
}

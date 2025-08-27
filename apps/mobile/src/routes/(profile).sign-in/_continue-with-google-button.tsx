import { GoogleIcon } from "~/icons/google";
import { Button, ButtonIcon, ButtonText } from "~/ui/button";

export function ContinueWithGoogleButton() {
  return (
    <Button variant="brand-google">
      <ButtonIcon Icon={GoogleIcon} />
      <ButtonText>Continue with Google</ButtonText>
    </Button>
  );
}

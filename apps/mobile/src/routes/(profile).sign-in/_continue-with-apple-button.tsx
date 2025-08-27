import { useState, useEffect } from "react";
import * as AppleAuthentication from "expo-apple-authentication";

import { AppleIcon } from "~/icons/apple";
import { Button, ButtonIcon, ButtonText } from "~/ui/button";

export function ContinueWithAppleButton() {
  return (
    <Button variant="brand-apple">
      <ButtonIcon Icon={AppleIcon} />
      <ButtonText>Continue with Apple</ButtonText>
    </Button>
  );
}

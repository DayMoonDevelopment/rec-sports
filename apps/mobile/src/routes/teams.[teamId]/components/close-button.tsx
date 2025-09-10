import { router } from "expo-router";

import { CrossIcon } from "~/icons/cross";

import { Button, ButtonIcon } from "~/ui/button";

export function CloseButton() {
  return (
    <Button onPress={() => router.back()} variant="secondary">
      <ButtonIcon Icon={CrossIcon} />
    </Button>
  );
}

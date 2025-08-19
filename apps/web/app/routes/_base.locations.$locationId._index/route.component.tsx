import { HubSection } from "~/components/hub-section";

import { Location } from "./location";

export function Component() {
  return (
    <>
      <Location />
      <HubSection showJoinButton>
        Rec is your all-in-one community sports hub.
      </HubSection>
    </>
  );
}

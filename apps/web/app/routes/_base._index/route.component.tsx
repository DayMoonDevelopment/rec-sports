import { LayoutDivider } from "~/ui/layout";

import { Founder } from "./_founder";
import { Hero } from "./_hero";
import { Problem } from "./_problem";
import { Solution } from "./_solution";

export function Component() {
  return (
    <>
      <Hero />
      <LayoutDivider width="narrow" />
      <Problem />
      <LayoutDivider width="narrow" />
      <Solution />
      <LayoutDivider />
      <Founder />
    </>
  );
}

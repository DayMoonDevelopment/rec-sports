import { LayoutDivider } from "~/ui/layout";

import { AllSports } from "./_all-sports";
import { Hero } from "./_hero";
import { Problem } from "./_problem";
import { Solution } from "./_solution";

export function Sport() {
  return (
    <>
      <Hero />
      <LayoutDivider />
      <Problem />
      <LayoutDivider />
      <Solution />
      <LayoutDivider />
      <AllSports />
    </>
  );
}

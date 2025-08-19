import { LayoutDivider } from "~/ui/layout";

import { AllSports } from "./_all-sports";
import { Content } from "./_content";
import { Hero } from "./_hero";
import { Hub } from "./_hub";

export function SportStateCity() {
  return (
    <>
      <Hero />
      <LayoutDivider width="narrow" className="mx-auto" />
      <Content />
      <LayoutDivider />
      <Hub />
      <LayoutDivider />
      <AllSports />
    </>
  );
}

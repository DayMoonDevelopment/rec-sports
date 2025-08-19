import { useLoaderData } from "react-router";

import { AllSports as AllSportsComponent, type SportSlug } from "~/components/all-sports";

import type { Route } from "./+types/route";

export function AllSports() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content = data.allSports;

  return (
    <AllSportsComponent
      headline={content.headline}
      deck={content.deck}
      items={content.items.filter((item) => item.slug !== data.currentSport).map(item => ({
        ...item,
        slug: item.slug as SportSlug
      }))}
    />
  );
}

import { useLoaderData } from "react-router";

import { HubSection } from "~/components/hub-section";

import type { Route } from "./+types/route";

export function Hub() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content = data.hub;

  return (
    <HubSection
      imgSrc={content.imgSrc}
      imgAlt={content.imgAlt}
      showJoinButton
    >
      {content.headline}
    </HubSection>
  );
}

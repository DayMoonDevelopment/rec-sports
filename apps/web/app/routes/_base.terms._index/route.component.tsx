import { useLoaderData } from "react-router";

import { RawHtml } from "~/components/raw-html";

import { LayoutSection, LayoutDivider } from "~/ui/layout";

import type { Route } from "./+types/route";

export function Component() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();

  return (
    <LayoutSection>
      <RawHtml html={data.content} />
    </LayoutSection>
  );
}

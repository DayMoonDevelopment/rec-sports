import { Link, useLoaderData } from "react-router";


import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { LayoutSection } from "~/ui/layout";

import type { Route } from "./+types/route";

export function Founder() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content = data.page.founder;

  return (
    <LayoutSection width="narrow">
      <div className="p-12 bg-card border border-gray-200 shadow-sm rounded-3xl root-founder">
        <div style={{ gridArea: "img" }}>
          <img
            src={content.image.src}
            alt={content.image.alt}
            className="rounded-full w-full aspect-square"
          />
        </div>

        <Text as="h2" variant="h3" style={{ gridArea: "headline" }}>
          {content.headline}
        </Text>

        <div style={{ gridArea: "deck" }}>
          {content.deck.map((line: string, index: number) => (
            <Text
              key={index}
              as="p"
              weight="normal"
              className="text-gray-600 mb-6"
            >
              {line}
            </Text>
          ))}

          <Button asChild className="sm:hidden">
            <Link to="#waitlist">Join the Waitlist</Link>
          </Button>
        </div>
      </div>
    </LayoutSection>
  );
}

import { useLoaderData, Link } from "react-router";

import { Button } from "~/ui/button";
import { LayoutSection } from "~/ui/layout";

import type { Route } from "./+types/route";

export function Content() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content = data.content;

  return (
    <LayoutSection width="narrow">
      <div
        className="body-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="mt-8">
        <Button asChild>
          <Link to="#waitlist">Join the Waitlist</Link>
        </Button>
      </div>
    </LayoutSection>
  );
}

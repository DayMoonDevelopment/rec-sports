import { useLoaderData, Link } from "react-router";

import { cn } from "~/lib/utils";
import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { LayoutSection, LayoutContainer } from "~/ui/layout";

import type { Route } from "./+types/route";
import type { ProblemType } from "./content";

export function Problem() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content: ProblemType = data.page.problem;

  return (
    <LayoutSection className="flex flex-col gap-14">
      <LayoutContainer>
        <Text as="h2" variant="headline-2">
          {content.headline}
        </Text>
      </LayoutContainer>

      <div className={cn("grid grid-cols-1 gap-8", "lg:grid-cols-3")}>
        {content.items.map((item, index: number) => (
          <div key={index} className="flex flex-col gap-2">
            <Text as="h3" variant="h2" className="text-gray-600">
              {item.title}
            </Text>
            <Text className="text-gray-400">{item.content}</Text>
          </div>
        ))}
      </div>

      <div>
        <Button asChild>
          <Link to="#waitlist">Join the Waitlist</Link>
        </Button>
      </div>
    </LayoutSection>
  );
}

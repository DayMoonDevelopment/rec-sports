import { Link, useLoaderData } from "react-router";

import { cn } from "~/lib/utils";
import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { LayoutSection, LayoutContainer } from "~/ui/layout";

import type { Route } from "./+types/route";

export function Solution() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content = data.solution;

  return (
    <LayoutSection className="flex flex-col gap-14">
      <LayoutContainer className="text-center mx-auto flex flex-col items-center gap-4 md:max-w-[66%]">
        <img src={content.imgSrc} alt={content.imgAlt} className="w-20" />
        <Text as="h2" variant="headline-2">
          {content.headline}
        </Text>
      </LayoutContainer>

      <div className={cn("flex gap-8", "flex-col lg:flex-row")}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <Text as="h3" variant="h1" className="text-gray-600">
              {content.overline}
            </Text>

            {content.deck.map((item, index) => (
              <Text
                as="p"
                variant="body"
                className="text-gray-400 mb-4"
                key={index}
              >
                {item}
              </Text>
            ))}
          </div>

          <Button asChild className="self-start">
            <Link to="#waitlist">Join the Waitlist</Link>
          </Button>
        </div>

        <div
          className={cn(
            "grid auto-rows-auto",
            "grid-cols-2 md:grid-cols-4 lg:grid-cols-2",
            "gap-2 lg:gap-4",
          )}
        >
          {content.items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-1 relative",
                "px-5 pb-4 pt-10 sm:pt-4 md:py-5 lg:p-6",
                "bg-card",
                "border-2 border-gray-200 rounded-3xl",
              )}
            >
              <Text
                as="span"
                variant="h3"
                className={cn("absolute", "top-2 right-3 lg:top-3 lg:right-5")}
              >
                {item.emoji}
              </Text>
              <Text
                as="h4"
                className="text-lg lg:text-2xl font-semibold text-gray-600"
              >
                {item.headline}
              </Text>
              <Text as="p" className="text-xs lg:text-base text-gray-400">
                {item.deck}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </LayoutSection>
  );
}

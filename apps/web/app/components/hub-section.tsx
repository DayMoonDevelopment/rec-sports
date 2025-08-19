import * as React from "react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";
import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { LayoutSection } from "~/ui/layout";

interface HubSectionProps {
  children: React.ReactNode; // This will be the title
  imgSrc?: string;
  imgAlt?: string;
  showJoinButton?: boolean;
  className?: string;
}

export function HubSection({
  children,
  imgSrc,
  imgAlt = "Rec app icon",
  showJoinButton = true,
  className,
}: HubSectionProps) {
  // Hardcoded items based on content structure
  const items = [
    {
      emoji: "🌐",
      headline: "Live Traffic",
      deck: "See how busy a location is in real-time.",
    },
    {
      emoji: "👋",
      headline: "Meet Others",
      deck: "Connect with other players in your area.",
    },
    {
      emoji: "📈",
      headline: "Ratings",
      deck: "Get information like cleanliness, safety, and how good it is for nighttime play.",
    },
    {
      emoji: "🔔",
      headline: "Get Notified",
      deck: "See the latest on new spots, how busy a location is, and who's playing.",
    },
  ];
  return (
    <LayoutSection className={cn("grid gap-8", "grid-cols-1 lg:grid-cols-2", className)}>
      <div className="flex flex-col gap-8">
        {imgSrc ? (
          <img src={imgSrc} alt={imgAlt} className="w-32" />
        ) : null}

        <Text as="h2" variant="headline-3" className="text-balance">
          {children}
        </Text>

        {showJoinButton ? (
          <Button asChild className="self-start">
            <Link to="#waitlist">Join the Waitlist</Link>
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "grid",
          "grid-cols-2 md:grid-cols-4 lg:grid-cols-2",
          "gap-2 lg:gap-4",
        )}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-1 relative",
              "px-6 py-8",
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
              as="h3"
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
    </LayoutSection>
  );
}
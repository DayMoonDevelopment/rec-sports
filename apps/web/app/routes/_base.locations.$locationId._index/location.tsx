import { Link, useLoaderData } from "react-router";

import { Badge, getSportBadgeVariant } from "~/ui/badge";
import { Button } from "~/ui/button";
import { LayoutSection } from "~/ui/layout";

import { Map } from "./map";

import type { Route } from "./+types/route";

export function Location() {
  const { location } = useLoaderData<Route.ComponentProps["loaderData"]>();

  return (
    <LayoutSection
      width="full"
      className="flex flex-col lg:grid lg:grid-cols-3 gap-y-8 lg:gap-8 pt-0"
      bg="pt-16"
    >
      <div className="lg:col-span-full">
        <h1 className="text-6xl font-bold mb-2 text-balance max-w-6xl">
          {location.name}
        </h1>
      </div>

      {/* Left Column - Location Info */}
      <div className="space-y-8">
        <span className="sr-only">Address</span>
        <div className="text-3xl">
          {location.address}
          <br />
          {location.city}, {location.state} {location.zipCode}
        </div>

        {/* Sport Facilities */}
        <div>
          <h2 className="text-sm font-lght text-muted-foreground mb-1.5">
            Facilities for
          </h2>
          <div className="flex flex-wrap gap-2">
            {location.sportTypes.map((sport) => (
              <Badge key={sport} variant={getSportBadgeVariant(sport)}>
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={() => {
              const query = encodeURIComponent(
                `${location.address}, ${location.city}, ${location.state}`,
              );
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${query}`,
                "_blank",
              );
            }}
          >
            Get Directions
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: location.name,
                  text: `Check out ${location.name} - a great place for ${location.sportTypes.join(", ")}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
          >
            Share with others
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground pt-4 border-t text-balance leading-tight italic">
          {`Notice something wrong? `}
          <Button asChild variant="link">
            <Link to="#">Report a correction</Link>
          </Button>
          {` to help others stay up-to-date with the latest information.`}
        </div>
      </div>

      {/* Right Column - Map */}
      <div className="bg-gray-50 rounded-lg overflow-hidden h-96 lg:h-full min-h-96 col-span-2">
        <Map />
      </div>
    </LayoutSection>
  );
}

import { useLoaderData, Link } from "react-router";

import { cn } from "~/lib/utils";
import { Card } from "~/primitives/card";
import { MoonIcon, BroomSparkleIcon, EmojiSmileIcon } from "~/primitives/icons";
import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { LayoutSection, LayoutContainer } from "~/ui/layout";

import type { Route } from "./+types/route";
import type { SolutionType } from "./content";

const LOCATION_ITEMS: [string, React.ComponentType<React.SVGProps<SVGSVGElement>>, string][] = [
  ["Cleanliness", BroomSparkleIcon, "text-emerald-500"],
  ["Safety", EmojiSmileIcon, "text-yellow-500"],
  ["Nighttime Play", MoonIcon, "text-indigo-800"],
];

export function Solution() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const content: SolutionType = data.page.solution;

  return (
    <LayoutSection className="flex flex-col gap-14 root-solution">
      <LayoutContainer className="flex flex-col gap-6">
        <Text as="h2" variant="headline-2">
          {content.headline}
        </Text>

        <Button asChild className="self-start">
          <Link to="#waitlist">Join the Waitlist</Link>
        </Button>
      </LayoutContainer>

      <div className="root-solution-bento">
        {/* Locations */}
        <Card
          style={{ gridArea: content.bento.locations.gridArea }}
          className={cn(
            "px-6 pt-6",
            "flex items-center",
            "flex-col-reverse gap-0",
            "xl:flex-row xl:gap-8",
          )}
        >
          <div className={cn("flex h-full", "xl:flex-[2]")}>
            <img
              src={content.bento.locations.imgSrc}
              alt={content.bento.locations.imgAlt}
              className="self-end"
            />
          </div>

          <div className={cn("flex flex-col gap-2", "xl:flex-[3]")}>
            <Card.Title>{content.bento.locations.title}</Card.Title>
            <Card.Content>{content.bento.locations.content}</Card.Content>
          </div>
        </Card>

        {/* People */}
        <Card
          className={cn(
            "p-6",
            "flex items-center",
            "flex-col-reverse gap-0",
            "xl:flex-row xl:gap-8 xl:pl-6",
          )}
          style={{ gridArea: content.bento.people.gridArea }}
        >
          <div className="flex-[3] flex flex-col gap-2">
            <Card.Title>{content.bento.people.title}</Card.Title>
            <Card.Content>{content.bento.people.content}</Card.Content>
          </div>

          <div className={cn("flex h-full", "xl:flex-[2]")}>
            <img
              src={content.bento.people.imgSrc}
              alt={content.bento.people.imgAlt}
              className="object-contain overflow-visible"
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card
          className={cn(
            "flex flex-col-reverse xl:flex-row items-center pt-4 pb-6 xl:pt-6 gap-4",
          )}
          style={{ gridArea: content.bento.notifications.gridArea }}
        >
          <div className="flex-1 flex flex-col gap-2 px-6">
            <Card.Title>{content.bento.notifications.title}</Card.Title>
            <Card.Content>{content.bento.notifications.content}</Card.Content>
          </div>

          <div className="xl:flex-1 px-4 xl:px-0">
            <img
              src={content.bento.notifications.imgSrc}
              alt={content.bento.notifications.imgAlt}
              className="h-full object-contain overflow-visible"
            />
          </div>
        </Card>

        {/* Alert */}
        <Card
          className="relative overflow-hidden flex flex-col md:justify-end xl:justify-center"
          style={{ gridArea: content.bento.alert.gridArea }}
        >
          <img
            src={content.bento.alert.imgSrc}
            alt={content.bento.alert.imgAlt}
            className="absolute xl:static w-full h-full xl:h-auto object-cover z-0 opacity-10 xl:opacity-100"
          />

          <div className="flex flex-col gap-2 p-6 z-10 relative">
            <Card.Title>{content.bento.alert.title}</Card.Title>
            <Card.Content>{content.bento.alert.content}</Card.Content>
          </div>
        </Card>

        {/* Ratings */}
        <Card
          className={cn(
            "p-6",
            "flex gap-6",
            "flex-col items-start xl:justify-center",
          )}
          style={{ gridArea: content.bento.ratings.gridArea }}
        >
          <div className="">
            <Card.Title>{content.bento.ratings.title}</Card.Title>
          </div>

          <div className="flex flex-col gap-3 text-muted-foreground">
            {LOCATION_ITEMS.map(([text, Icon, color], i) => (
              <div key={i} className="flex flex-row gap-2">
                <Icon className={color} height={24} width={24} />
                <Text as="span">{text}</Text>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic */}
        <Card
          className="flex flex-col justify-between relative overflow-hidden"
          style={{ gridArea: content.bento.traffic.gridArea }}
        >
          <div className="flex flex-col gap-2 p-6 xl:pt-12 z-10">
            <Card.Title>{content.bento.traffic.title}</Card.Title>
            <Card.Content>{content.bento.traffic.content}</Card.Content>
          </div>

          <div
            className={cn(
              "w-full aspect-square",
              "aspect-square",
              "z-0",
              "top-6",
              "absolute xl:static",
              "opacity-40 xl:opacity-100",
            )}
          >
            <img
              src={content.bento.traffic.imgSrc}
              alt={content.bento.traffic.imgAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        {/* Sports Cards */}
        <Card
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(/root/mesh.png)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            gridArea: content.bento.sports.gridArea,
          }}
          className="hidden xl:flex items-center justify-center relative"
        >
          <img
            src={content.bento.sports.imgSrc}
            alt={content.bento.sports.imgAlt}
            className="absolute h-full w-full object-cover"
          />
        </Card>
      </div>
    </LayoutSection>
  );
}

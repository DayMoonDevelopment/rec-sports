import { cva } from "class-variance-authority";
import { Link } from "react-router";

import { cn } from "~/lib/utils";
import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { LayoutSection } from "~/ui/layout";


export type SportSlug = 
  | "baseball"
  | "kickball" 
  | "basketball"
  | "pickleball"
  | "tennis"
  | "golf"
  | "frisbee-golf"
  | "hockey"
  | "softball"
  | "soccer"
  | "football"
  | "volleyball"
  | "ultimate-frisbee";

const sportButton = cva("flex flex-row w-full items-center gap-2 text-left", {
  variants: {
    sport: {
      baseball: "text-sport-baseball",
      kickball: "text-sport-kickball",
      basketball: "text-sport-basketball",
      pickleball: "text-sport-pickleball",
      tennis: "text-sport-tennis",
      golf: "text-sport-golf",
      "frisbee-golf": "text-sport-frisbee-golf",
      hockey: "text-sport-hockey",
      softball: "text-sport-softball",
      soccer: "text-sport-soccer",
      football: "text-sport-football",
      volleyball: "text-sport-volleyball",
      "ultimate-frisbee": "text-sport-ultimate-frisbee",
    },
  },
});

export function AllSports({
  headline,
  deck,
  items,
}: {
  headline: string;
  deck: string;
  items: {
    headline: string;
    slug: SportSlug;
    imgSrc: string;
    imgAlt: string;
  }[];
}) {
  return (
    <LayoutSection className="flex flex-col xl:flex-row gap-14 items-start">
      <div className="flex flex-col gap-8 xl:flex-[2]">
        <div className="text-balance">
          <Text as="h2" variant="headline-3">
            {headline}
          </Text>
          <Text
            as="h3"
            variant="headline-3"
            weight="light"
            className="text-muted-foreground mt-1"
          >
            {deck}
          </Text>
        </div>

        <Button asChild className="self-start">
          <Link to="#waitlist">Join the Waitlist</Link>
        </Button>
      </div>

      <div
        className={cn(
          "xl:flex-[3] w-full",
          "gap-4 items-start justify-center",
          "flex flex-col sm:grid md:auto-cols-fr",
          "sm:grid-cols-2 md:grid-cols-3",
        )}
      >
        {items.map((item) => (
          <Button
            asChild
            variant="secondary"
            key={item.slug}
            className="w-full"
          >
            <Link to={`/${item.slug}`}>
              <div className={sportButton({ sport: item.slug })}>
                <img src={item.imgSrc} alt={item.imgAlt} className="w-6" />

                <div className="flex-1">{item.headline}</div>
              </div>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071C12.9024 18.3166 12.9024 17.6834 13.2929 17.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L13.2929 6.70711C12.9024 6.31658 12.9024 5.68342 13.2929 5.29289Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </Button>
        ))}

        <Text
          weight="medium"
          className="text-muted-foreground text-center col-start-2 w-full"
        >
          and more!
        </Text>
      </div>
    </LayoutSection>
  );
}

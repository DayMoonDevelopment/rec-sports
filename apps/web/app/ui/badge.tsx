import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/100 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Sport-specific variants using theme colors with opacity 5%
        baseball:
          "border-sport-baseball/10 bg-sport-baseball/10 text-sport-baseball [a&]:hover:bg-sport-baseball",
        kickball:
          "border-sport-kickball/10 bg-sport-kickball/10 text-sport-kickball [a&]:hover:bg-sport-kickball",
        basketball:
          "border-sport-basketball/10 bg-sport-basketball/10 text-sport-basketball [a&]:hover:bg-sport-basketball",
        pickleball:
          "border-sport-pickleball/10 bg-sport-pickleball/10 text-sport-pickleball [a&]:hover:bg-sport-pickleball",
        tennis:
          "border-sport-tennis/10 bg-sport-tennis/10 text-sport-tennis [a&]:hover:bg-sport-tennis",
        golf: "border-sport-golf/10 bg-sport-golf/10 text-sport-golf [a&]:hover:bg-sport-golf",
        "frisbee-golf":
          "border-sport-frisbee-golf/10 bg-sport-frisbee-golf/10 text-sport-frisbee-golf [a&]:hover:bg-sport-frisbee-golf",
        hockey:
          "border-sport-hockey/10 bg-sport-hockey/10 text-sport-hockey [a&]:hover:bg-sport-hockey",
        softball:
          "border-sport-softball/10 bg-sport-softball/10 text-sport-softball [a&]:hover:bg-sport-softball",
        soccer:
          "border-sport-soccer/10 bg-sport-soccer/10 text-sport-soccer [a&]:hover:bg-sport-soccer",
        football:
          "border-sport-football/10 bg-sport-football/10 text-sport-football [a&]:hover:bg-sport-football",
        volleyball:
          "border-sport-volleyball/10 bg-sport-volleyball/10 text-sport-volleyball [a&]:hover:bg-sport-volleyball",
        "ultimate-frisbee":
          "border-sport-ultimate-frisbee/10 bg-sport-ultimate-frisbee/10 text-sport-ultimate-frisbee [a&]:hover:bg-sport-ultimate-frisbee",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

// Helper function to get sport-specific badge variant
function getSportBadgeVariant(
  sport: string,
): VariantProps<typeof badgeVariants>["variant"] {
  const sportMap: Record<
    string,
    VariantProps<typeof badgeVariants>["variant"]
  > = {
    baseball: "baseball",
    kickball: "kickball",
    basketball: "basketball",
    pickleball: "pickleball",
    tennis: "tennis",
    golf: "golf",
    "frisbee-golf": "frisbee-golf",
    hockey: "hockey",
    softball: "softball",
    soccer: "soccer",
    football: "football",
    volleyball: "volleyball",
    "ultimate-frisbee": "ultimate-frisbee",
  };

  return sportMap[sport.toLowerCase()] || "default";
}

export { Badge, badgeVariants, getSportBadgeVariant };

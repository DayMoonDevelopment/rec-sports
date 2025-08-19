import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, View, type ViewProps, type TextProps } from "react-native";
import { cn } from "~/lib/utils";

// Badge Context
interface BadgeContextValue {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
}

const BadgeContext = React.createContext<BadgeContextValue | undefined>(
  undefined,
);

function useBadgeContext() {
  const context = React.useContext(BadgeContext);
  return context || { variant: undefined, size: undefined };
}

const badgeVariants = cva(
  "flex-row items-center justify-center rounded-full border px-2 py-1 self-start",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary",
        secondary: "border-transparent bg-secondary",
        destructive: "border-transparent bg-destructive",
        outline: "border-border bg-transparent",
        // Sport-specific variants using theme colors
        baseball: "border-sport-baseball bg-sport-baseball",
        kickball: "border-sport-kickball bg-sport-kickball",
        basketball: "border-sport-basketball bg-sport-basketball",
        pickleball: "border-sport-pickleball bg-sport-pickleball",
        tennis: "border-sport-tennis bg-sport-tennis",
        golf: "border-sport-golf bg-sport-golf",
        disc_golf: "border-sport-disc-golf bg-sport-disc-golf",
        hockey: "border-sport-hockey bg-sport-hockey",
        softball: "border-sport-softball bg-sport-softball",
        soccer: "border-sport-soccer bg-sport-soccer",
        football: "border-sport-football bg-sport-football",
        volleyball: "border-sport-volleyball bg-sport-volleyball",
        ultimate: "border-sport-ultimate bg-sport-ultimate",
      },
      size: {
        sm: "px-2 py-0.5",
        default: "px-2 py-1",
        lg: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const badgeTextVariants = cva("text-white text-xs font-medium text-center", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      // Sport-specific text colors
      baseball: "text-white",
      kickball: "text-white",
      basketball: "text-white",
      pickleball: "text-white",
      tennis: "text-white",
      golf: "text-white",
      disc_golf: "text-white",
      hockey: "text-white",
      softball: "text-white",
      soccer: "text-white",
      football: "text-white",
      volleyball: "text-white",
      ultimate: "text-white",
    },
    size: {
      sm: "text-xs",
      default: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface BadgeProviderProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
}

interface BadgeTextProps extends TextProps {
  children: React.ReactNode;
  variant?: VariantProps<typeof badgeTextVariants>["variant"];
  size?: VariantProps<typeof badgeTextVariants>["size"];
}

function BadgeProvider({ variant, size, children }: BadgeProviderProps) {
  return (
    <BadgeContext.Provider value={{ variant, size }}>
      {children}
    </BadgeContext.Provider>
  );
}

function Badge({
  className,
  variant: propVariant,
  size: propSize,
  children,
  ...props
}: BadgeProps) {
  const contextValue = { variant: propVariant, size: propSize };
  
  return (
    <BadgeContext.Provider value={contextValue}>
      <View
        className={cn(badgeVariants({ variant: propVariant, size: propSize }), className)}
        {...props}
      >
        {children}
      </View>
    </BadgeContext.Provider>
  );
}

function BadgeText({
  className,
  variant: propVariant,
  size: propSize,
  children,
  ...props
}: BadgeTextProps) {
  const context = useBadgeContext();
  const variant = propVariant ?? context.variant;
  const size = propSize ?? context.size;

  return (
    <Text
      className={cn(badgeTextVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Text>
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
    disc_golf: "disc_golf",
    hockey: "hockey",
    softball: "softball",
    soccer: "soccer",
    football: "football",
    volleyball: "volleyball",
    ultimate_frisbee: "ultimate",
  };

  return sportMap[sport.toLowerCase()] || "default";
}

export {
  Badge,
  BadgeText,
  badgeVariants,
  badgeTextVariants,
  getSportBadgeVariant,
};

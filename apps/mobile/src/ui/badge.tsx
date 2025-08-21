import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, View, type ViewProps, type TextProps } from "react-native";
import { Sport } from "@rec/types";
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
  "flex-row items-center justify-center gap-1 rounded-full border px-2 py-1 self-start",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary",
        secondary: "border-transparent bg-secondary",
        destructive: "border-transparent bg-destructive",
        outline: "border-border bg-transparent",
        // Sport-specific variants using Sport enum values
        [Sport.Baseball]: "border-sport-baseball bg-sport-baseball",
        [Sport.Kickball]: "border-sport-kickball bg-sport-kickball",
        [Sport.Basketball]: "border-sport-basketball bg-sport-basketball",
        [Sport.Pickleball]: "border-sport-pickleball bg-sport-pickleball",
        [Sport.Tennis]: "border-sport-tennis bg-sport-tennis",
        [Sport.Golf]: "border-sport-golf bg-sport-golf",
        [Sport.DiscGolf]: "border-sport-disc-golf bg-sport-disc-golf",
        [Sport.Hockey]: "border-sport-hockey bg-sport-hockey",
        [Sport.Softball]: "border-sport-softball bg-sport-softball",
        [Sport.Soccer]: "border-sport-soccer bg-sport-soccer",
        [Sport.Football]: "border-sport-football bg-sport-football",
        [Sport.Volleyball]: "border-sport-volleyball bg-sport-volleyball",
        [Sport.Ultimate]: "border-sport-ultimate bg-sport-ultimate",
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
      // Sport-specific text colors using Sport enum values
      [Sport.Baseball]: "text-white",
      [Sport.Kickball]: "text-white",
      [Sport.Basketball]: "text-white",
      [Sport.Pickleball]: "text-white",
      [Sport.Tennis]: "text-white",
      [Sport.Golf]: "text-white",
      [Sport.DiscGolf]: "text-white",
      [Sport.Hockey]: "text-white",
      [Sport.Softball]: "text-white",
      [Sport.Soccer]: "text-white",
      [Sport.Football]: "text-white",
      [Sport.Volleyball]: "text-white",
      [Sport.Ultimate]: "text-white",
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

// todo : come back to this and have the props extend the props of Icon
interface BadgeIconProps {
  Icon: React.ComponentType<any>;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
  [key: string]: any;
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
        className={cn(
          badgeVariants({ variant: propVariant, size: propSize }),
          className,
        )}
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

function BadgeIcon({
  Icon,
  variant: propVariant,
  size: propSize,
  ...iconProps
}: BadgeIconProps) {
  const context = useBadgeContext();
  const size = propSize ?? context.size;

  // Define icon sizes based on badge size
  const iconSizes = {
    sm: 12,
    default: 14,
    lg: 16,
  } as const;

  const iconSize = iconSizes[size || "default"];

  return (
    <View className="-ml-0.5">
      <Icon width={iconSize} height={iconSize} {...iconProps} />
    </View>
  );
}

export { Badge, BadgeText, BadgeIcon, badgeVariants, badgeTextVariants };

export type { BadgeProps, BadgeTextProps, BadgeIconProps };

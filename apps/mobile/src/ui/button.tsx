import * as React from "react";
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

// Button Context
interface ButtonContextValue {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

const ButtonContext = React.createContext<ButtonContextValue | undefined>(
  undefined,
);

function useButtonContext() {
  const context = React.useContext(ButtonContext);
  return context || { variant: undefined, size: undefined };
}

const buttonVariants = cva(
  "flex-row items-center justify-center gap-2 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        outline: "border border-border bg-background",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        link: "bg-transparent",
        "brand-apple": "bg-black",
        "brand-google": "bg-white border-border border-2",
      },
      size: {
        default: "h-12 px-5 py-1.5",
        sm: "h-8 px-3 py-1.5",
        lg: "h-10 px-6 py-3",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-sm font-medium text-center", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      link: "text-primary",
      "brand-apple": "text-white",
      "brand-google": "text-black",
    },
    size: {
      default: "text-lg",
      sm: "text-sm",
      lg: "text-base",
      icon: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonIconVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      link: "text-primary",
      "brand-apple": "text-white",
      "brand-google": "",
    },
    size: {
      default: "size-6",
      sm: "size-4",
      lg: "size-5",
      icon: "size-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

interface ButtonTextProps extends TextProps {
  children: React.ReactNode;
}

interface ButtonIconProps {
  Icon: React.ComponentType<any>;
  [key: string]: any;
}

function Button({
  className,
  variant: propVariant,
  size: propSize,
  children,
  ...props
}: ButtonProps) {
  const contextValue = { variant: propVariant, size: propSize };

  return (
    <ButtonContext.Provider value={contextValue}>
      <Pressable
        className={cn(
          buttonVariants({ variant: propVariant, size: propSize }),
          className,
        )}
        {...props}
      >
        {children}
      </Pressable>
    </ButtonContext.Provider>
  );
}

function ButtonText({ className, children, ...props }: ButtonTextProps) {
  const context = useButtonContext();

  return (
    <Text
      className={cn(
        buttonTextVariants({ variant: context.variant, size: context.size }),
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

function ButtonIcon({ Icon, ...iconProps }: ButtonIconProps) {
  const context = useButtonContext();

  return (
    <View className="-ml-0.5">
      <Icon
        {...iconProps}
        className={cn(
          buttonIconVariants({ variant: context.variant, size: context.size }),
        )}
      />
    </View>
  );
}

export { Button, ButtonText, ButtonIcon, buttonVariants, buttonTextVariants };

export type { ButtonProps, ButtonTextProps, ButtonIconProps };

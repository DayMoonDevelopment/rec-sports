import * as React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "~/lib/utils";

import type { ImageProps, ViewProps, TextProps } from "react-native";

function Avatar({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center size-8",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ImageProps) {
  return (
    <Image
      className={cn("absolute inset-0 w-full h-full rounded-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: TextProps) {
  return (
    <View
      className={cn(
        "w-full h-full flex iteme-center justify-center",
        className,
      )}
    >
      <Text
        className="text-xs font-medium text-muted-foreground text-center"
        {...props}
      />
    </View>
  );
}

export { Avatar, AvatarImage, AvatarFallback };

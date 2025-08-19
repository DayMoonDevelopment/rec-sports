import { cn } from "~/lib/utils";
import { Text } from "~/primitives/text";
import type { TextProps } from "~/primitives/text";

export function Content({ children, className, ...props }: TextProps) {
  return (
    <Text as="p" className={cn("text-gray-700", className)} {...props}>
      {children}
    </Text>
  );
}

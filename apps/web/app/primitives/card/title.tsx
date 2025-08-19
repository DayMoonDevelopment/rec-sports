import { Text } from "~/primitives/text";
import type { TextProps } from "~/primitives/text";

export function Title({ children, ...props }: TextProps) {
  return (
    <Text as="h3" variant="h2" {...props}>
      {children}
    </Text>
  );
}

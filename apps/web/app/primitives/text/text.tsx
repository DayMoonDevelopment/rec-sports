import { cn } from "~/lib/utils";

import { textStyles } from "./text.styles";

export type TextType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
export type TextVariant =
  | "headline-1"
  | "headline-2"
  | "headline-3"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "small"
  | "tiny";
export type TextWeight = "normal" | "bold" | "medium" | "semibold" | "light";

export type TextProps = {
  children: React.ReactNode;
  as?: TextType;
  variant?: TextVariant;
  className?: string;
  weight?: TextWeight;
  style?: React.CSSProperties;
};

export function Text({
  children,
  as = "p",
  variant = "body",
  weight = undefined,
  className,
  style,
}: TextProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        textStyles({
          variant,
          weight,
        }),
        className
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}

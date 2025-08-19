import { cn } from "~/lib/utils";

import { Content } from "./content";
import { Title } from "./title";

export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("bg-card border  rounded-3xl", className)} style={style}>
      {children}
    </div>
  );
}

Card.Title = Title;
Card.Content = Content;

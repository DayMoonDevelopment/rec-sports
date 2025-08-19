import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

export function LayoutSection({
  children,
  className,
  width = "full",
  bg = undefined,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  width?: "full" | "narrow";
  bg?: string;
  id?: string;
}) {
  return (
    <section className={cn("px-4 py-24", bg)} id={id}>
      <div
        className={cn(
          className,
          "mx-auto",
          width === "narrow" ? "xl:max-w-4xl" : null,
          width === "full" ? "container" : null,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function LayoutContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className, "xl:max-w-[66%]")}>{children}</div>;
}

export function LayoutDivider({
  width = "full",
  className,
}: {
  width?: "full" | "narrow";
  className?: string;
}) {
  return (
    <div className="container mx-auto">
      <div className={cn(className, dividerVariants({ width }))}></div>
    </div>
  );
}

const dividerVariants = cva("border border-b-1", {
  variants: {
    width: {
      full: "w-full",
      narrow: "xl:max-w-4xl",
    },
  },
  defaultVariants: {
    width: "full",
  },
});

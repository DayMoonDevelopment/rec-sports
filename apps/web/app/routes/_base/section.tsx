import { cn } from "~/lib/utils";

export function Section({
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
          width === "full" ? "container" : null
        )}
      >
        {children}
      </div>
    </section>
  );
}

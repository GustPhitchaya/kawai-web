import { cn } from "cn";

export type SectionTone = "canvas" | "panel" | "deep";

const toneClass: Record<SectionTone, string> = {
  canvas: "",
  panel: "bg-panel",
  deep: "bg-deep text-on-deep overflow-hidden",
};

/**
 * One content section: the fluid vertical rhythm, the page gutter, and
 * the 1220px centred `.wrap` from the draft, in one place.
 */
export function Section({
  id,
  tone = "canvas",
  className,
  wrapClassName,
  ariaLabel,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  wrapClassName?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative py-section px-gutter",
        toneClass[tone],
        className,
      )}
    >
      <div className={cn("mx-auto max-w-wrap", wrapClassName)}>{children}</div>
    </section>
  );
}

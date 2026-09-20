import { cn } from "cn";

/**
 * The small mono label above a section heading, with the hairline that
 * trails it (`.kicker::after` in the draft).
 */
export function Kicker({
  children,
  tone = "paper",
  className,
}: {
  children: React.ReactNode;
  tone?: "paper" | "deep";
  className?: string;
}) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "kicker-rule text-kicker mb-[18px] flex items-center gap-3 font-mono font-medium tracking-[0.22em] uppercase",
        tone === "deep" ? "text-brand-light" : "text-brand-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

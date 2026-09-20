import { cn } from "cn";

/**
 * The three small rounded labels in the draft, which look similar but
 * are not the same thing:
 *   fact  — `.course .facts span`, a mono outline tag
 *   chip  — `.chips b`, a filled brand-tinted tag
 *   badge — `.badge`, the frosted hero pill with a bold highlight
 */
export function Pill({
  variant = "fact",
  className,
  children,
}: {
  variant?: "fact" | "chip" | "badge";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-pill inline-flex items-center",
        variant === "fact" &&
          "text-tag text-ink-soft border border-line px-[11px] py-[5px] font-mono tracking-[0.06em]",
        variant === "chip" &&
          "bg-brand-muted text-brand-hover px-[14px] py-[6px] text-[0.85rem] font-bold",
        variant === "badge" &&
          "text-ink-soft border border-line gap-[10px] bg-white/62 px-[15px] py-[8px] font-mono text-[0.73rem] tracking-[0.1em] backdrop-blur-[8px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The hero badge: a bold brand-coloured highlight plus its caption. */
export function Badge({
  highlight,
  text,
  frosted = true,
  className,
}: {
  highlight: string;
  text: string;
  frosted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-pill text-ink-soft border border-line inline-flex items-center gap-[10px] px-[15px] py-[8px] font-mono tracking-[0.1em]",
        frosted
          ? "bg-white/62 text-[0.73rem] backdrop-blur-[8px]"
          : "text-[0.72rem]",
        className,
      )}
    >
      <b className="text-brand-ink font-bold">{highlight}</b>
      {text}
    </span>
  );
}

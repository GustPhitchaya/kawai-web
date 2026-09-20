import { cn } from "cn";
import { Kicker } from "./kicker";
import type { SectionHeadContent } from "@/content/types";

/**
 * `.head` from the draft: kicker, h2, optional lead paragraph, capped
 * at min(820px, 92%).
 */
export function SectionHead({
  content,
  tone = "paper",
  headingClassName,
  className,
}: {
  content: SectionHeadContent;
  tone?: "paper" | "deep";
  headingClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-head max-w-[min(820px,92%)]", className)}>
      <Kicker tone={tone}>{content.kicker}</Kicker>
      <h2
        className={cn(
          "text-h2 mb-[18px]",
          tone === "deep" && "text-white",
          headingClassName,
        )}
      >
        {content.heading}
      </h2>
      {content.lead ? (
        <p
          className={cn(
            "text-head-lead max-w-[62ch]",
            tone === "deep" ? "text-on-deep-muted" : "text-ink-soft",
          )}
        >
          {content.lead}
        </p>
      ) : null}
    </div>
  );
}

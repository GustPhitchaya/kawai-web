import { Button } from "@/components/ui/button";
import type { Cta } from "@/content/types";

/**
 * Renders a content-defined CTA as an anchor. External links (LINE,
 * Facebook, Instagram) get the usual noopener treatment.
 */
export function CtaButton({
  cta,
  size = "pill",
  className,
}: {
  cta: Cta;
  size?: "pill" | "pillSm" | "pillLg";
  className?: string;
}) {
  return (
    <Button asChild variant={cta.variant} size={size} className={className}>
      <a
        href={cta.href}
        {...(cta.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {cta.label}
      </a>
    </Button>
  );
}

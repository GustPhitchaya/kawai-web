import { CtaButton } from "@/components/primitives/cta-button";
import { Kicker } from "@/components/primitives/kicker";
import { Badge } from "@/components/primitives/pill";
import { HeroPicture } from "./hero-picture";
import { hero } from "@/content";

/**
 * The hero phones and reduced-motion users get. Hidden by default and
 * revealed by the same five gates that hide the scrub hero, so exactly
 * one of the two is ever on screen.
 */
export default function HeroStatic() {
  const { kicker, heading, sub, badge, ctas } = hero.static;

  return (
    <section
      aria-label={hero.label}
      className="px-gutter hidden pt-static-hero pb-14 scrub-off:block"
    >
      <Kicker>{kicker}</Kicker>
      <h1 className="text-h1-static">{heading}</h1>
      <p className="text-sub text-ink-soft mt-4">{sub}</p>
      <div className="mt-[22px]">
        <Badge highlight={badge.highlight} text={badge.text} frosted={false} />
      </div>
      <div className="mt-[26px] flex flex-wrap gap-3">
        {ctas.map((cta) => (
          <CtaButton
            key={cta.label}
            cta={cta}
            className="max-ph:w-full"
          />
        ))}
      </div>
      <div className="rounded-tile shadow-panel bg-panel mt-[30px] overflow-hidden">
        <HeroPicture className="h-auto w-full" />
      </div>
    </section>
  );
}

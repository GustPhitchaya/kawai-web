import { CtaButton } from "@/components/primitives/cta-button";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { CoursesTrack } from "./courses-track";
import { coursesHead, instruments } from "@/content";

/**
 * Server shell. Heading and instrument block stay server components;
 * only the track is client code, because only it needs scroll position.
 *
 * The track runs full-bleed on purpose — it sets its own inline and
 * scroll padding so every card aligns to the page gutter — so this
 * section can't use the `Section` primitive's centred wrap around it.
 */
export default function CoursesSection() {
  return (
    <section id="courses" className="bg-panel py-section relative">
      <div className="px-gutter">
        <div className="mx-auto max-w-wrap">
          <StaffDivider />
        </div>
      </div>

      <CoursesTrack
        head={
          <Reveal>
            <RevealPart>
              <SectionHead content={coursesHead} className="mb-0" />
            </RevealPart>
          </Reveal>
        }
      />

      <div className="px-gutter mt-10">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            {/* A solid warm panel rather than the old dashed outline, which
                read as a placeholder. The chips are white with brand-ink
                text: the `chip` Pill's brand-muted fill measures under AA
                on this ground. */}
            <RevealPart className="bg-canvas rounded-card p-inst grid grid-cols-[1fr_auto] items-center gap-x-8 gap-y-5 max-dt:grid-cols-1">
              <div>
                <h3 className="mb-1 text-[1.2rem] font-bold">{instruments.title}</h3>
                <p className="text-ink-soft max-w-[62ch] text-[0.96rem]">
                  {instruments.body}
                </p>
                <ul className="mt-3.5 flex flex-wrap gap-2">
                  {instruments.chips.map((chip) => (
                    <li
                      key={chip}
                      className="bg-panel border-brand/25 text-brand-ink rounded-pill border px-3.25 py-1.25 text-[0.85rem] font-medium"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
              <CtaButton cta={instruments.cta} />
            </RevealPart>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

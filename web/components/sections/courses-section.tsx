import { CtaButton } from "@/components/primitives/cta-button";
import { Pill } from "@/components/primitives/pill";
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
          <Reveal>
            <RevealPart>
              <SectionHead content={coursesHead} />
            </RevealPart>
          </Reveal>
        </div>
      </div>

      <CoursesTrack />

      <div className="px-gutter mt-10">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <RevealPart className="border-line-strong rounded-card p-inst grid grid-cols-[1fr_auto] items-center gap-5.5 border border-dashed max-dt:grid-cols-1">
              <div>
                <h3 className="mb-2 text-[1.15rem]">{instruments.title}</h3>
                <p className="text-ink-soft max-w-[62ch] text-[0.96rem]">
                  {instruments.body}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {instruments.chips.map((chip) => (
                    <Pill key={chip} variant="chip">
                      {chip}
                    </Pill>
                  ))}
                </div>
              </div>
              <CtaButton cta={instruments.cta} />
            </RevealPart>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

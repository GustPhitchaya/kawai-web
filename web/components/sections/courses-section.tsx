import { CtaButton } from "@/components/primitives/cta-button";
import { Pill } from "@/components/primitives/pill";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { CoursesTrack } from "./courses-track";
import { coursesHead, instruments } from "@/content";

/**
 * Server shell. The heading and the instrument block stay server
 * components; only the track itself is client code, because only it
 * needs scroll position.
 */
export default function CoursesSection() {
  return (
    <section id="courses" className="bg-panel relative">
      <div className="px-gutter pt-section">
        <div className="mx-auto max-w-wrap">
          <StaffDivider />
          <Reveal>
            <RevealPart>
              <SectionHead content={coursesHead} className="mb-0" />
            </RevealPart>
          </Reveal>
        </div>
      </div>

      <CoursesTrack />

      <div className="px-gutter pb-section">
        <div className="mx-auto max-w-wrap">
          <Reveal>
            <RevealPart className="border-line-strong rounded-card p-inst grid grid-cols-[1fr_auto] items-center gap-[22px] border border-dashed max-dt:grid-cols-1">
              <div>
                <h3 className="mb-2 text-[1.15rem]">{instruments.title}</h3>
                <p className="text-ink-soft max-w-[62ch] text-[0.96rem]">
                  {instruments.body}
                </p>
                <div className="mt-[14px] flex flex-wrap gap-2">
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

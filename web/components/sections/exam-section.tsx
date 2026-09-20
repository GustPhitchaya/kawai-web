import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { exam } from "@/content";

/** Staggered top offsets on wide screens (the draft's :nth-child rules). */
const OFFSET = ["dt:mt-14", "dt:mt-7", ""];

export default function ExamSection() {
  return (
    <Section id={exam.id}>
      <Reveal>
        <RevealPart>
          <SectionHead content={exam.head} className="mb-0" />
        </RevealPart>

        <div className="mt-head grid grid-cols-3 items-start gap-gap-sm max-dt:grid-cols-2 max-tb:grid-cols-1">
          {exam.levels.map((level, i) => (
            <RevealPart
              key={level.level}
              className={`bg-panel border-line rounded-tile p-card-lg duration-[550ms] ease-kawai border transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-panel ${OFFSET[i]}`}
            >
              <div className="text-kicker text-brand-ink mb-[14px] font-mono tracking-[0.18em]">
                {level.level}
              </div>
              <h3 className="mb-2.5 text-[1.2rem]">{level.title}</h3>
              <p className="text-ink-soft text-[0.95rem]">{level.body}</p>
            </RevealPart>
          ))}
        </div>

        <RevealPart className="border-brand text-ink-soft mt-note flex items-center gap-3 border-l-2 pl-4 text-[0.95rem]">
          {exam.note}
        </RevealPart>
      </Reveal>
    </Section>
  );
}

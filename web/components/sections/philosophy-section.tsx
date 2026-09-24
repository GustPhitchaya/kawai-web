import Image from "next/image";
import { Kicker } from "@/components/primitives/kicker";
import { PianoKeys } from "@/components/primitives/piano-keys";
import {
  Reveal,
  RevealGroup,
  RevealPart,
} from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { philosophy } from "@/content";

export default function PhilosophySection() {
  const { head, paragraphs, pillword, image, highlight } = philosophy;

  return (
    <Section id={philosophy.id}>
      <div className="dots" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <StaffDivider />

      <Reveal>
        <RevealPart className="mb-head">
          <Kicker>{head.kicker}</Kicker>
          <h2 className="text-h2">{head.heading}</h2>
        </RevealPart>

        <RevealGroup className="grid grid-cols-[1.06fr_0.94fr] items-stretch gap-gap-lg max-dt:grid-cols-1">
          <RevealPart>
            {paragraphs.map((text, i) => (
              <p
                key={i}
                className="text-philo text-ink-soft [&+&]:mt-5"
              >
                {text}
              </p>
            ))}
            <p className="text-pillword font-display mt-[34px] max-w-[30ch] font-bold">
              <em className="text-brand not-italic">{pillword.terms[0]}</em>
              {pillword.joiner}
              <em className="text-brand not-italic">{pillword.terms[1]}</em>
              {pillword.suffix}
            </p>
          </RevealPart>

          <RevealPart className="rounded-card shadow-panel bg-placeholder group min-h-[330px] overflow-hidden max-dt:min-h-0">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 980px) 100vw, 45vw"
              loading="lazy"
              className="duration-[1300ms] ease-kawai h-full w-full object-cover object-[58%_50%] transition-transform group-hover:scale-[1.045] max-dt:aspect-[16/10] max-dt:h-auto"
            />
          </RevealPart>
        </RevealGroup>

        <RevealPart className="hilite-glow bg-panel rounded-card shadow-panel border-line p-panel mt-hilite-top relative grid grid-cols-[minmax(0,1fr)_clamp(180px,23vw,310px)] items-center gap-gap-hilite overflow-hidden border max-dt:grid-cols-1 max-dt:gap-[26px]">
          <div>
            <div className="text-tag text-brand-ink mb-[14px] font-mono tracking-[0.18em] uppercase">
              {highlight.tag}
            </div>
            <h3 className="text-h3-hilite max-w-[27ch]">{highlight.heading}</h3>
          </div>
          <PianoKeys />
        </RevealPart>
      </Reveal>
    </Section>
  );
}

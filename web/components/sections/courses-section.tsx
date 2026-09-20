import Image from "next/image";
import { CtaButton } from "@/components/primitives/cta-button";
import { Pill } from "@/components/primitives/pill";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { Button } from "@/components/ui/button";
import { courses, coursesHead, instruments } from "@/content";

export default function CoursesSection() {
  return (
    <Section id="courses" tone="panel">
      <StaffDivider />

      <Reveal>
        <RevealPart>
          <SectionHead content={coursesHead} className="mb-0" />
        </RevealPart>

        <div className="mt-head grid gap-gap-xs">
          {courses.map((course) => (
            <RevealPart
              key={course.slug}
              as="article"
              className="bg-canvas border-line rounded-card duration-[550ms] ease-kawai group grid grid-cols-[264px_1fr_auto] items-center gap-gap-course border p-4 transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brand-muted hover:shadow-panel max-dt:grid-cols-[200px_1fr] max-tb:grid-cols-1"
            >
              <div className="rounded-thumb bg-placeholder-warm h-[185px] w-[264px] flex-none overflow-hidden max-dt:h-[150px] max-dt:w-[200px] max-tb:h-[200px] max-tb:w-full">
                <Image
                  src={course.image.src}
                  alt={course.image.alt}
                  width={course.image.width}
                  height={course.image.height}
                  sizes="(max-width: 720px) 100vw, (max-width: 980px) 200px, 264px"
                  loading="lazy"
                  className="duration-[1100ms] ease-kawai h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="min-w-0">
                <div className="text-kicker text-brand-ink mb-2 font-mono tracking-[0.14em] uppercase">
                  {course.ageLabel}
                </div>
                <h3 className="text-h3-course mb-1">{course.title}</h3>
                <div className="text-ink-soft mb-2.5 text-[0.9rem]">
                  {course.titleTh}
                </div>
                <p className="text-ink-soft max-w-[56ch] text-[0.96rem]">
                  {course.description}
                </p>
                <div className="mt-[14px] flex flex-wrap gap-2">
                  {course.facts.map((fact) => (
                    <Pill key={fact}>{fact}</Pill>
                  ))}
                </div>
              </div>

              <div className="pr-[14px] max-dt:col-span-full max-dt:pr-0">
                <Button asChild variant="ghostOutline" size="pillSm">
                  <a href={course.ctaHref}>{course.ctaLabel}</a>
                </Button>
              </div>
            </RevealPart>
          ))}
        </div>

        <RevealPart className="border-line-strong rounded-card p-inst mt-[clamp(26px,3vw,42px)] grid grid-cols-[1fr_auto] items-center gap-[22px] border border-dashed max-dt:grid-cols-1">
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
    </Section>
  );
}

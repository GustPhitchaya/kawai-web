import Image from "next/image";
import { Pill } from "@/components/primitives/pill";
import { Button } from "@/components/ui/button";
import type { Course } from "@/content/types";

/**
 * One course, as a portrait card for the horizontal row.
 *
 * The old stacked layout gave the photo 264×185 next to a wide column
 * of text, which read as a directory listing. Standing the card up lets
 * the photograph carry it — these are pictures of children enjoying
 * themselves, and they were the smallest thing on screen.
 *
 * Every card is presented identically; the only state it carries is
 * hover, using the same lift the exam and review cards use.
 */
export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="bg-panel border-line rounded-card duration-[550ms] ease-kawai group flex w-[min(460px,72vw)] shrink-0 snap-start flex-col overflow-hidden border transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-panel">
      <div className="bg-placeholder-warm relative aspect-[16/10] overflow-hidden">
        <Image
          src={course.image.src}
          alt={course.image.alt}
          fill
          sizes="(max-width: 980px) 80vw, 460px"
          loading="lazy"
          className="duration-[1100ms] ease-kawai object-cover transition-transform group-hover:scale-105"
        />
        <span className="rounded-pill bg-panel/92 text-brand-ink absolute top-4 left-4 px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.14em] backdrop-blur-sm">
          {course.ageLabel}
        </span>
      </div>

      <div className="p-card flex flex-1 flex-col">
        <h3 className="text-h3-course">{course.title}</h3>
        <div className="text-ink-soft mt-1 text-[0.9rem]">{course.titleTh}</div>
        <p className="text-ink-soft mt-3 text-[0.96rem]">{course.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.facts.map((fact) => (
            <Pill key={fact}>{fact}</Pill>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button asChild variant="ghostOutline" size="pillSm">
            <a href={course.ctaHref}>{course.ctaLabel}</a>
          </Button>
        </div>
      </div>
    </article>
  );
}

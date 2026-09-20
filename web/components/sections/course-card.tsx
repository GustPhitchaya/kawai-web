import Image from "next/image";
import { cn } from "cn";
import { Pill } from "@/components/primitives/pill";
import { Button } from "@/components/ui/button";
import type { Course } from "@/content/types";

/**
 * One course, as a portrait card for the horizontal track.
 *
 * The old row layout gave the photo 264×185 next to a wide column of
 * text, which read as a directory listing. Standing the card up lets
 * the photograph carry the card — these are pictures of children
 * enjoying themselves, and they were the smallest thing on screen.
 */
export function CourseCard({
  course,
  index,
  active,
  onFocus,
}: {
  course: Course;
  index: number;
  active: boolean;
  onFocus?: (index: number) => void;
}) {
  return (
    <article
      data-active={active}
      className={cn(
        // The inactive state is carried by scale and shadow, never by
        // opacity on the card: dimming the whole card takes its body
        // text below AA contrast, which axe rightly flags.
        "bg-panel border-line rounded-card duration-500 ease-kawai group flex w-[min(460px,72vw)] shrink-0 snap-center flex-col overflow-hidden border transition-[transform,box-shadow]",
        active ? "shadow-panel scale-100" : "scale-[0.965]",
      )}
    >
      <div className="bg-placeholder-warm relative aspect-[16/10] overflow-hidden">
        <Image
          src={course.image.src}
          alt={course.image.alt}
          fill
          sizes="(max-width: 980px) 80vw, 460px"
          loading="lazy"
          className={cn(
            "duration-[1100ms] ease-kawai object-cover transition-transform group-hover:scale-105",
            !active && "opacity-70",
          )}
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
            <a href={course.ctaHref} onFocus={() => onFocus?.(index)}>
              {course.ctaLabel}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

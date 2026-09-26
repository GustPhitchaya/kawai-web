import Image from "next/image";
import {
  CalendarDays,
  Clock,
  Music,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Course, CourseSpec } from "@/content/types";

const SPEC_ICON: Record<CourseSpec["kind"], LucideIcon> = {
  format: Users,
  teachers: User,
  length: Clock,
  duration: CalendarDays,
  repertoire: Music,
};

/**
 * One course in the horizontal row.
 *
 * The details are labelled rows in the same order on every card, in
 * place of a heap of outline pills that wrapped differently on each
 * card and couldn't be compared across courses. The rows sit at the
 * bottom of the body (`mt-auto`), so they line up across cards however
 * long each description runs.
 *
 * The age is a solid badge because it is what a parent chooses a
 * course by. The action is a full-width footer, so every card ends at
 * the same line.
 */
export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="bg-panel border-line rounded-card duration-550 ease-kawai group flex w-[min(380px,78vw)] shrink-0 snap-start flex-col overflow-hidden border transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-panel">
      <div className="bg-placeholder-warm relative aspect-16/10 overflow-hidden">
        <Image
          src={course.image.src}
          alt={course.image.alt}
          fill
          sizes="(max-width: 980px) 78vw, 380px"
          loading="lazy"
          className="duration-1100 ease-kawai object-cover transition-transform group-hover:scale-105"
        />
        <span className="bg-brand-ink rounded-pill absolute top-4 left-4 px-3.25 py-1.25 text-[0.84rem] font-semibold text-white">
          {course.ageLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-5 max-ph:px-5">
        <h3 className="text-h3-course">{course.title}</h3>
        <div className="text-ink-soft mt-0.5 text-[0.86rem]">
          {course.titleTh}
        </div>
        <p className="text-ink-soft mt-3 mb-4 text-[0.92rem]">
          {course.description}
        </p>

        <ul className="mt-auto">
          {course.specs.map((spec) => {
            const Icon = SPEC_ICON[spec.kind];
            return (
              <li
                key={spec.text}
                className="border-line flex items-center gap-2.5 border-t py-1.75 text-[0.92rem]"
              >
                <Icon
                  className="text-brand-ink size-4.25 shrink-0"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {spec.text}
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href={course.ctaHref}
        className="border-line text-brand-ink hover:text-brand duration-300 ease-kawai mt-4 flex items-center justify-between border-t px-6 py-3.75 text-[0.95rem] font-semibold no-underline transition-colors max-ph:px-5"
      >
        <span>
          {course.ctaLabel}
          {/* Five identical link texts need telling apart by ear. */}
          <span className="sr-only"> {course.title}</span>
        </span>
        <span
          aria-hidden="true"
          className="duration-300 ease-kawai transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </a>
    </article>
  );
}

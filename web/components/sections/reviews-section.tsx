import { Kicker } from "@/components/primitives/kicker";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { courses, testimonials, testimonialsHead } from "@/content";
import type { Testimonial } from "@/content/types";

/**
 * The review is the card's main text, dark and at reading size, rather
 * than a caption under a faint quote mark. Under it: who said it, their
 * child's course, and the age that course is for. The age is what
 * lets a parent find the reviews for their own child's age.
 *
 * The section sits on `warm` so it breaks from the white events and
 * branches sections on either side of it.
 */
export default function ReviewsSection() {
  return (
    <Section id="reviews" tone="warm">
      <Reveal>
        <RevealPart className="mb-11 max-w-[min(820px,92%)]">
          <Kicker>{testimonialsHead.kicker}</Kicker>
          <h2 className="text-h2">{testimonialsHead.heading}</h2>
        </RevealPart>

        <div className="grid grid-cols-3 items-stretch gap-5.5 max-dt:grid-cols-1 max-dt:gap-4">
          {testimonials.map((item) => (
            <ReviewCard key={item.id} item={item} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/**
 * Looked up at render, which for this static page is build time, so a
 * review pointing at a course that doesn't exist fails the build
 * instead of shipping a card with no course on it.
 */
function courseFor(item: Testimonial) {
  const course = courses.find((c) => c.slug === item.course);
  if (!course) {
    throw new Error(
      `Testimonial "${item.id}" names course "${item.course}", which is not in courses.ts`,
    );
  }
  return course;
}

function ReviewCard({ item }: { item: Testimonial }) {
  const course = courseFor(item);

  return (
    <RevealPart
      as="figure"
      className="bg-panel rounded-card shadow-panel duration-550 ease-kawai m-0 flex flex-col px-7.5 pt-7.5 pb-6.5 transition-transform hover:-translate-y-1 max-ph:px-5.5 max-ph:pt-5.5 max-ph:pb-5"
    >
      {/* Drawn rather than typed: at bold weight Kanit's “ is two
          slanted bars that read as "//". */}
      <svg
        viewBox="0 0 32 24"
        aria-hidden="true"
        className="fill-brand h-6 w-8 shrink-0 max-ph:h-5 max-ph:w-6.5"
      >
        <path d="M0 24V14.4C0 6.4 4.3 1.6 12.2 0l1.5 3.2C9.4 4.6 7.3 7.3 7 11h6v13H0Zm18 0V14.4C18 6.4 22.3 1.6 30.2 0l1.5 3.2c-4.3 1.4-6.4 4.1-6.7 7.8h6v13H18Z" />
      </svg>
      <blockquote className="m-0 mt-3.5 max-ph:mt-2.5">
        <p className="max-w-[60ch] text-[1.12rem] leading-[1.7] max-ph:text-base">
          {item.quote}
        </p>
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 pt-5.5 max-ph:pt-4">
        <span
          aria-hidden="true"
          className="bg-brand-muted text-brand-ink grid size-11 shrink-0 place-items-center rounded-full text-[1.1rem] font-bold max-ph:size-10"
        >
          {item.initial}
        </span>
        <span className="flex grow flex-col">
          <b className="text-[0.95rem] font-semibold">{item.author}</b>
          <span className="text-ink-soft text-[0.82rem]">
            คอร์ส {course.title}
          </span>
        </span>
        <span className="text-brand-ink border-brand/30 rounded-pill shrink-0 border px-2.75 py-0.75 text-[0.78rem] font-medium">
          {course.ageLabel}
        </span>
      </figcaption>
    </RevealPart>
  );
}

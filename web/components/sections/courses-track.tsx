"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { CourseCard } from "./course-card";
import { useScrubEnabled } from "@/hooks/use-scrub-enabled";
import { courses } from "@/content";

/** How much page scroll the track consumes, as a multiple of viewport height. */
const TRACK_VH = 3.4;

/**
 * The five courses as one horizontal journey instead of five identical
 * rows — the content is a progression by age, and the old layout said
 * nothing about that while eating 2,000px of page.
 *
 * Two real modes, not one mode plus a hide:
 *
 *  - desktop, fine pointer, motion allowed: vertical scroll drives the
 *    track sideways, using the same sticky/useScroll/useSpring shape as
 *    `hero-scrub.tsx`.
 *  - everything else: a natively scrollable snap carousel. On a phone
 *    that is simply the better control — real momentum, real swipe, no
 *    JavaScript — so it is the fallback rather than a consolation.
 */
export function CoursesTrack() {
  const scrub = useScrubEnabled();
  return scrub ? <ScrubTrack /> : <SnapTrack />;
}

/* ------------------------------ shared ----------------------------- */

function AgeRail({ active }: { active: number }) {
  return (
    <ol className="mt-8 flex items-center justify-center gap-3">
      {courses.map((course, i) => (
        <li key={course.slug} className="flex items-center gap-3">
          <span
            className={`duration-500 ease-kawai font-mono text-[0.72rem] tracking-[0.14em] transition-colors ${
              i === active ? "text-brand-ink font-bold" : "text-ink-soft"
            }`}
          >
            {course.ageLabel.replace("อายุ ", "")}
          </span>
          {i < courses.length - 1 ? (
            <span className="bg-line-strong h-px w-6" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------- scrub mode --------------------------- */

function ScrubTrack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [pad, setPad] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.0005,
  });
  const x = useTransform(progress, [0, 1], [0, -maxScroll]);

  // Thai line breaking makes the real track width impossible to derive
  // from vw units, so measure it and keep measuring on resize.
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    // Pad the track by half the leftover width so the first and last
    // cards can reach the centre too. With that padding the geometry
    // works out exactly linear — travel to centre card i is
    // i × (card + gap), and maxScroll is 4 × (card + gap) — which is
    // why `active` below can be a plain round() of progress.
    const measure = () => {
      const card = track.firstElementChild as HTMLElement | null;
      const gutter = card
        ? Math.max(0, (viewport.clientWidth - card.offsetWidth) / 2)
        : 0;
      setPad(gutter);
      setMaxScroll(
        Math.max(0, track.scrollWidth + gutter * 2 - viewport.clientWidth),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.round(value * (courses.length - 1));
    setActive((prev) => (prev === next ? prev : next));
  });

  // Tabbing into an off-screen card has to bring it on screen, or focus
  // vanishes somewhere to the right of the viewport.
  const focusCard = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    // Document position, not offsetTop — the section sits inside a
    // positioned ancestor, so offsetTop would be measured from there.
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    const target = top + (index / Math.max(1, courses.length - 1)) * span;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `${TRACK_VH * 100}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div ref={viewportRef}>
          <motion.div
            ref={trackRef}
            style={{ x, paddingLeft: pad, paddingRight: pad }}
            className="flex w-max gap-gap-sm"
          >
            {courses.map((course, i) => (
              <CourseCard
                key={course.slug}
                course={course}
                index={i}
                active={i === active}
                onFocus={focusCard}
              />
            ))}
          </motion.div>
          <AgeRail active={active} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- snap mode ---------------------------- */

function SnapTrack() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Nearest card to the scroller's centre, so the rail tracks a swipe.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const update = () => {
      const centre = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestGap = Infinity;
      Array.from(scroller.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const gap = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, []);

  return (
    <div>
      <div
        ref={scrollerRef}
        style={{ paddingInline: "max(var(--spacing-gutter), calc((100% - min(460px, 72vw)) / 2))" }}
        className="scrollbar-none flex snap-x snap-mandatory gap-gap-sm overflow-x-auto pb-4"
      >
        {courses.map((course, i) => (
          <CourseCard
            key={course.slug}
            course={course}
            index={i}
            active={i === active}
          />
        ))}
      </div>
      <AgeRail active={active} />
    </div>
  );
}

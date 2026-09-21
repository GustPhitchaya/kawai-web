"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { CourseCard } from "./course-card";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { courses } from "@/content";

/**
 * The five courses as one horizontal row instead of five identical
 * stacked rows, which ate 2,000px of page saying the same thing five
 * times.
 *
 * Plain native horizontal scrolling, one behaviour for everyone: real
 * momentum, real swipe, focused cards scrolled into view by the
 * browser, and nothing taken over from the vertical scroll. Every card
 * is presented identically — no "active" card, so there is no state to
 * derive from scroll position and nothing to keep in sync.
 *
 * A mouse has no easy way to scroll sideways, so it gets two ways in:
 * drag the row directly (see `use-drag-scroll`), or step a card at a
 * time with the arrow buttons. Both are hidden or irrelevant on touch,
 * where swiping is the obvious gesture.
 */
export function CoursesTrack() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Mouse users can drag the row directly; touch already pans natively.
  useDragScroll(scrollerRef);

  // The only thing scroll position drives is whether each arrow is
  // still usable.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      setAtStart(scroller.scrollLeft <= 1);
      setAtEnd(scroller.scrollLeft >= max - 1);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const [first, second] = Array.from(scroller.children) as HTMLElement[];
    // One card plus one gap, measured rather than assumed — the gap is
    // a clamp() and the card width depends on Thai line breaking.
    const distance = second
      ? second.offsetLeft - first.offsetLeft
      : scroller.clientWidth;
    scroller.scrollBy({ left: distance * direction, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        style={{
          // Left edge sits flush at the page gutter, so the first card
          // opens the row rather than floating in empty space. The
          // right edge gets the same gutter, so the row simply ends.
          paddingInline: "var(--spacing-gutter)",
          // snap-start aligns a card to the scrollport edge, which
          // would put it flush against the window rather than on the
          // page gutter. scroll-padding moves the snap line inward to
          // match, so every card lands on the same left margin the
          // first one starts at.
          scrollPaddingInline: "var(--spacing-gutter)",
        }}
        className="scrollbar-none flex cursor-grab snap-x snap-mandatory gap-gap-sm overflow-x-auto pb-4 data-[dragging=true]:cursor-grabbing coarse:cursor-auto"
      >
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      <TrackArrow side="left" disabled={atStart} onClick={() => step(-1)} />
      <TrackArrow side="right" disabled={atEnd} onClick={() => step(1)} />
    </div>
  );
}

function TrackArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "คอร์สก่อนหน้า" : "คอร์สถัดไป"}
      className={cn(
        "bg-panel border-line shadow-panel duration-300 ease-kawai absolute top-[38%] z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border transition-[opacity,transform]",
        "hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-0",
        // Touch users swipe; the arrows would only be in the way.
        "coarse:hidden",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

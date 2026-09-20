"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const LINES = 5;

/**
 * Which staff line the note sits on for each section in order. Not
 * `index % 5` — a deliberate contour so scrolling the page plays
 * something shaped like a melody rather than a sawtooth.
 * 0 is the top line.
 */
const MELODY = [2, 2, 1, 3, 0, 2, 4, 1, 0, 3, 2, 4, 3];

/**
 * A fixed five-line staff across the foot of the viewport with a brand
 * note head travelling along it as you read.
 *
 * What keeps it from being a plain progress bar: the note's *vertical*
 * position encodes which section you're in, so it steps between lines
 * as you move through the page. It extends the same staff motif the
 * site already uses in `StaffDivider` and the ambient `env-rules`.
 *
 * Purely decorative — `aria-hidden`, no pointer events, and it conveys
 * nothing a screen reader needs.
 */
export function StaffProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [line, setLine] = useState(MELODY[0]);
  const sections = useRef<HTMLElement[]>([]);

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.0005,
  });
  const x = useTransform(reduce ? scrollYProgress : smooth, [0, 1], [
    "0%",
    "100%",
  ]);

  useEffect(() => {
    sections.current = Array.from(
      document.querySelectorAll<HTMLElement>("main > section"),
    );
  }, []);

  // Pick whichever section owns the middle of the viewport. State only
  // changes when the line actually changes, so this is a handful of
  // renders across the whole page, not one per scroll event.
  useMotionValueEvent(scrollYProgress, "change", () => {
    const middle = window.innerHeight / 2;
    const index = sections.current.findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= middle && rect.bottom >= middle;
    });
    if (index < 0) return;
    const next = MELODY[index % MELODY.length];
    setLine((prev) => (prev === next ? prev : next));
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-9 short:hidden"
    >
      {Array.from({ length: LINES }, (_, i) => (
        <div
          key={i}
          // A neutral mid-grey so the staff reads over both the cream
          // sections and the dark ones without needing to know which.
          className="absolute inset-x-0 h-px bg-[rgb(128_124_118/0.34)]"
          style={{ top: 12 + i * 5 }}
        />
      ))}

      <motion.div
        style={{ left: x }}
        animate={{ top: 12 + line * 5 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 26 }
        }
        className="bg-brand absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_6px_rgb(219_42_27/0.35)]"
      />
    </div>
  );
}

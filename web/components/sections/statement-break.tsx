"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { SplitWords } from "@/components/primitives/split-words";
import type { Statement } from "@/content/types";

/**
 * A full-width typographic break between card sections.
 *
 * The words rise as you scroll past, driven by the block's own scroll
 * progress — the same mechanism the hero bands use, so `SplitWords` is
 * reused rather than reimplemented. The point is rhythm: the page runs
 * on a long uniform beat of headings and cards, and this interrupts it
 * with one line at a scale nothing else on the page uses.
 *
 * Reduced motion swaps the *driver*, never the markup. Branching the
 * JSX on `useReducedMotion()` renders one tree on the server and
 * another on the client, which is a hydration mismatch (React #418);
 * holding the progress value at 1 instead shows the line whole with an
 * identical DOM.
 */
export function StatementBreak({ statement }: { statement: Statement }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const deep = statement.tone === "deep";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scrubbed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const pinned = useMotionValue(0);
  const k = reduce ? pinned : scrubbed;

  useEffect(() => {
    if (reduce) pinned.set(1);
  }, [reduce, pinned]);

  // A little counter-drift, so the block doesn't sit dead still.
  const y = useTransform(k, [0, 1], [36, 0]);

  return (
    <section
      ref={ref}
      id={`statement-${statement.id}`}
      aria-label={statement.text}
      className={`px-gutter py-section relative ${
        deep ? "bg-deep text-on-deep" : "bg-canvas text-ink"
      }`}
    >
      <motion.p
        style={{ y }}
        className="text-statement font-display mx-auto max-w-wrap font-bold"
      >
        <SplitWords
          text={statement.text}
          seed={statement.seed}
          k={k}
          emphasis={statement.emphasis}
          emphasisClassName={deep ? "text-brand-light" : "text-brand"}
        />
      </motion.p>
    </section>
  );
}

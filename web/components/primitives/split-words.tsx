"use client";

import { useMemo } from "react";
import { cn } from "cn";
import { motion, useTransform, type MotionValue } from "motion/react";
import { splitWords } from "@/lib/split";

/**
 * Word-by-word rise, driven by the band's `k` progress rather than a
 * timeline. Each word has a deterministic threshold (see lib/split.ts)
 * and then ramps over 1/2.9 of the remaining progress, matching the
 * draft's `.rise .w` clamp expression.
 *
 * Ships two copies of the text, exactly as the draft did: a plain one
 * for screen readers and an aria-hidden one made of animated spans.
 */

const RAMP = 1 / 2.9;

function Word({
  text,
  th,
  k,
  className,
}: {
  text: string;
  th: number;
  k: MotionValue<number>;
  className?: string;
}) {
  const kc = useTransform(k, [th, th + RAMP], [0, 1], { clamp: true });
  const y = useTransform(kc, [0, 1], [22, 0]);

  return (
    <motion.span
      // cn(), not a template literal: Tailwind scans source text for
      // class candidates, and `whitespace-pre${...}` with no separator
      // is never extracted — the rule simply wouldn't be generated.
      className={cn("inline-block whitespace-pre", className)}
      style={{ opacity: kc, y }}
    >
      {text}
    </motion.span>
  );
}

export function SplitWords({
  text,
  seed,
  k,
  emphasis,
  emphasisClassName,
}: {
  text: string;
  seed: number;
  k: MotionValue<number>;
  /** Whole space-separated words to single out. */
  emphasis?: string[];
  emphasisClassName?: string;
}) {
  const words = useMemo(() => splitWords(text, seed), [text, seed]);
  const marked = useMemo(() => new Set(emphasis ?? []), [emphasis]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word
            key={i}
            text={word.text}
            th={word.th}
            k={k}
            className={
              marked.has(word.text.trim()) ? emphasisClassName : undefined
            }
          />
        ))}
      </span>
    </>
  );
}

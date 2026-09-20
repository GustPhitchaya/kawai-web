"use client";

import { useMemo } from "react";
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
}: {
  text: string;
  th: number;
  k: MotionValue<number>;
}) {
  const kc = useTransform(k, [th, th + RAMP], [0, 1], { clamp: true });
  const y = useTransform(kc, [0, 1], [22, 0]);

  return (
    <motion.span
      className="inline-block whitespace-pre"
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
}: {
  text: string;
  seed: number;
  k: MotionValue<number>;
}) {
  const words = useMemo(() => splitWords(text, seed), [text, seed]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={i} text={word.text} th={word.th} k={k} />
        ))}
      </span>
    </>
  );
}

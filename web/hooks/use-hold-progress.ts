"use client";

import { useCallback, useRef, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  type AnimationPlaybackControlsWithThen,
} from "motion/react";

interface Options {
  holdMs: number;
  releaseMs: number;
  thresholds: number[];
  /** Fired on each threshold crossing, in both directions. */
  onThreshold: (index: number, on: boolean, silent: boolean) => void;
  onComplete: (silent: boolean) => void;
}

/**
 * Drives the hold-to-build button. Progress fills over `holdMs` while
 * held and decays over `releaseMs` when released, and crossing each
 * threshold lights a key and sounds its note.
 *
 * Completion is sticky: once the chord lands it never resets, matching
 * the draft's `holdDone` flag.
 */
export function useHoldProgress({
  holdMs,
  releaseMs,
  thresholds,
  onThreshold,
  onComplete,
}: Options) {
  const progress = useMotionValue(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);

  const crossed = useRef<boolean[]>(thresholds.map(() => false));
  const controls = useRef<AnimationPlaybackControlsWithThen | null>(null);
  const doneRef = useRef(false);
  /** Set while completing without a user gesture, so nothing sounds. */
  const silent = useRef(false);

  useMotionValueEvent(progress, "change", (value) => {
    thresholds.forEach((threshold, i) => {
      const on = value >= threshold;
      if (on !== crossed.current[i]) {
        crossed.current[i] = on;
        onThreshold(i, on, silent.current);
      }
    });

    if (value >= 1 && !doneRef.current) {
      doneRef.current = true;
      setDone(true);
      onComplete(silent.current);
    }
  });

  const start = useCallback(() => {
    if (doneRef.current) return;
    setHolding(true);
    controls.current?.stop();
    const remaining = 1 - progress.get();
    controls.current = animate(progress, 1, {
      duration: (holdMs / 1000) * remaining,
      ease: "linear",
    });
  }, [holdMs, progress]);

  const end = useCallback(() => {
    setHolding(false);
    if (doneRef.current) return;
    controls.current?.stop();
    const travelled = progress.get();
    if (travelled <= 0) return;
    controls.current = animate(progress, 0, {
      duration: (releaseMs / 1000) * travelled,
      ease: "linear",
    });
  }, [releaseMs, progress]);

  /** Jump straight to the finished state without playing anything. */
  const completeSilently = useCallback(() => {
    if (doneRef.current) return;
    controls.current?.stop();
    silent.current = true;
    setHolding(false);
    progress.set(1);
    silent.current = false;
  }, [progress]);

  return { progress, holding, done, start, end, completeSilently };
}

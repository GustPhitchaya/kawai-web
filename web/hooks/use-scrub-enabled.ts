"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Whether this visitor should get scroll-driven ("scrubbed") motion
 * that takes over the vertical scroll — the horizontal courses track,
 * for one.
 *
 * Deliberately separate from `use-scene-enabled.ts`: that one is the
 * same media-query gate *plus* a WebGL probe. Hijacking scroll needs
 * no GPU, so the two must not share a hook or phones would be judged
 * on whether they can render 3D.
 *
 * Touch devices are excluded on purpose. Converting vertical swipes
 * into horizontal movement is hostile on a phone; those visitors get a
 * real, natively-scrollable carousel instead.
 */
export function useScrubEnabled(): boolean {
  const wideEnough = useMediaQuery("(min-width: 981px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return wideEnough && finePointer && !reduceMotion;
}

"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { harmony } from "@/content";

/** Matches the `gap-2.5` between keys in the CSS row. */
const GAP_PX = 10;
/** The CSS row lifts a lit key by 14px; keep the same travel in 3D. */
const RISE_PX = 14;

export interface HarmonyLayout {
  /** World-space x centre of each key. */
  x: number[];
  /** World-space height of each key. */
  height: number[];
  width: number;
  /** y of the floor every key stands on. */
  baseY: number;
  rise: number;
  viewWidth: number;
  viewHeight: number;
}

/**
 * Derives key geometry from the canvas viewport rather than hard-coded
 * world units, so the 3D keys occupy exactly the same rectangle the CSS
 * keys did — which is what keeps the DOM caption row lined up with them
 * at every width.
 */
export function useHarmonyLayout(): HarmonyLayout {
  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  return useMemo(() => {
    const count = harmony.keys.length;
    const gap = (GAP_PX / size.width) * viewport.width;
    const width = (viewport.width - gap * (count - 1)) / count;
    const left = -viewport.width / 2 + width / 2;

    return {
      x: harmony.keys.map((_, i) => left + i * (width + gap)),
      height: harmony.keys.map((key) => (key.heightPct / 100) * viewport.height),
      width,
      baseY: -viewport.height / 2,
      rise: (RISE_PX / size.height) * viewport.height,
      viewWidth: viewport.width,
      viewHeight: viewport.height,
    };
  }, [viewport.width, viewport.height, size.width, size.height]);
}

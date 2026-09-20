"use client";

import { useMediaQuery } from "./use-media-query";

let webglSupport: boolean | null = null;

/**
 * Probes WebGL once per page load and caches the answer. Creating a
 * throwaway context is cheap, but doing it on every render is not.
 */
function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Whether this visitor should get the WebGL harmony scene.
 *
 * The gate has to be "don't mount", not CSS `display:none` — a hidden
 * `<Canvas>` still holds a GL context and still runs its frame loop.
 * That's why this differs from the hero's `scrub-off:` CSS variant.
 *
 * Desktop only, by agreement: phones and tablets keep the CSS keys.
 */
export function useSceneEnabled(): boolean {
  const wideEnough = useMediaQuery("(min-width: 981px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return wideEnough && finePointer && !reduceMotion && hasWebGL();
}

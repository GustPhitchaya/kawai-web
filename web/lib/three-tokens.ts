import { Color } from "three";

/**
 * Bridges the design system into Three.js.
 *
 * `app/globals.css` stays the single source of truth for colour — these
 * are read from the live CSS custom properties rather than duplicated
 * as hex literals, so retheming the site retints the scene too.
 *
 * All four tokens are plain hex (no `rgb()` with alpha), which is what
 * `new Color(string)` accepts directly.
 */
export interface ThreeTokens {
  brand: Color;
  brandLight: Color;
  deep: Color;
  onDeep: Color;
}

const FALLBACKS: Record<string, string> = {
  "--kawai-brand": "#DB2A1B",
  "--kawai-brand-light": "#F2705E",
  "--kawai-deep": "#0F1015",
  "--kawai-on-deep": "#F3F0EC",
};

function read(name: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || FALLBACKS[name];
}

export function readThreeTokens(): ThreeTokens {
  return {
    brand: new Color(read("--kawai-brand")),
    brandLight: new Color(read("--kawai-brand-light")),
    deep: new Color(read("--kawai-deep")),
    onDeep: new Color(read("--kawai-on-deep")),
  };
}

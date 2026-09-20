import { rng } from "./rng";

export interface SplitWord {
  /** The word, with its trailing space except on the last one. */
  text: string;
  /** The `--th` threshold at which this word starts rising. */
  th: number;
}

const SPREAD = 0.55;

/**
 * Splits a headline into per-word reveal thresholds, matching the
 * draft's `splitWords()` exactly: an even ramp across the words plus a
 * small seeded jitter, rounded to three decimals.
 */
export function splitWords(text: string, seed: number): SplitWord[] {
  const words = text.split(" ");
  const r = rng(seed);
  const last = Math.max(1, words.length - 1);

  return words.map((word, i) => ({
    text: i < words.length - 1 ? `${word} ` : word,
    th: Number(((i / last) * SPREAD + r() * 0.05).toFixed(3)),
  }));
}

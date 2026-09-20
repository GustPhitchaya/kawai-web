/**
 * Seeded linear congruential generator — a faithful port of the draft's
 * `rng()`. Word-split thresholds must come out identical on the server
 * and the client, so this is used instead of Math.random(); otherwise
 * the hero headline hydrates with a mismatch.
 */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

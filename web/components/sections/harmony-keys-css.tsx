import { harmony } from "@/content";

/**
 * The original CSS key row, unchanged. This is the fallback whenever
 * the WebGL scene is gated off — phones, tablets, reduced motion, or no
 * WebGL — so it has to stand on its own rather than look like a
 * degraded placeholder. Captions stay inside the keys here so they
 * travel with them, exactly as before.
 */
export function HarmonyKeysCss({ lit }: { lit: boolean[] }) {
  return (
    <div className="flex h-full items-end gap-2.5">
      {harmony.keys.map((key, i) => (
        <div
          key={key.caption}
          data-on={lit[i]}
          style={{ height: `${key.heightPct}%` }}
          className={`hkey duration-[550ms] ease-kawai relative flex-1 overflow-hidden rounded-t-lg rounded-b-xl border bg-white/7 transition-[transform,border-color] ${
            lit[i] ? "-translate-y-[14px] border-brand/60" : "border-white/13"
          }`}
        >
          <span
            className={`text-label duration-500 ease-kawai absolute inset-x-0 bottom-[14px] z-[2] text-center font-mono tracking-[0.1em] transition-colors ${
              lit[i] ? "text-white" : "text-white/72"
            }`}
          >
            {key.caption}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Captions for the 3D mode, as a DOM overlay rather than in-scene text:
 * drei's `<Text>` would need a Thai-capable font file (100KB+) and
 * still shape Thai imperfectly.
 *
 * All five keys are bottom-aligned, so every caption sits at the same
 * height and a plain flex row lines up with the rendered keys.
 */
export function HarmonyCaptions({ lit }: { lit: boolean[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[14px] flex gap-2.5">
      {harmony.keys.map((key, i) => (
        <span
          key={key.caption}
          className={`text-label duration-500 ease-kawai flex-1 text-center font-mono tracking-[0.1em] transition-colors ${
            lit[i] ? "text-white" : "text-white/72"
          }`}
        >
          {key.caption}
        </span>
      ))}
    </div>
  );
}

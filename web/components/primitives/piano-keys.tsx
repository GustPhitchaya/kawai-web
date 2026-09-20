import { cn } from "cn";

/** White key, or black key where `true`. Mirrors the draft's key order. */
const KEYS = [
  false,
  true,
  false,
  true,
  false,
  false,
  true,
  false,
  true,
  false,
  true,
  false,
];

/**
 * The decorative CSS keyboard in the philosophy highlight. Structural
 * only — the black keys overlap their neighbours via negative margins,
 * which lives in `@layer components`.
 */
export function PianoKeys({ className }: { className?: string }) {
  return (
    <div className={cn("piano-keys", className)} aria-hidden="true">
      {KEYS.map((black, i) => (
        <i key={i} className={black ? "blk" : undefined} />
      ))}
    </div>
  );
}

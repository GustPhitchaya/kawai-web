"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useChordSynth } from "@/hooks/use-chord-synth";
import { useHoldProgress } from "@/hooks/use-hold-progress";
import { harmony } from "@/content";

const FREQS = harmony.keys.map((key) => key.freq);

export function HarmonyInteractive() {
  const reduce = useReducedMotion();
  const { ensure, playNote, playChord } = useChordSynth();
  const [lit, setLit] = useState<boolean[]>(() => harmony.keys.map(() => false));

  const onThreshold = useCallback(
    (index: number, on: boolean, silent: boolean) => {
      setLit((prev) => {
        const next = [...prev];
        next[index] = on;
        return next;
      });
      if (on && !silent) playNote(FREQS[index], 0, 0.16, 1.9);
    },
    [playNote],
  );

  const onComplete = useCallback(
    (silent: boolean) => {
      if (!silent) playChord(FREQS);
    },
    [playChord],
  );

  const { progress, holding, done, start, end, completeSilently } =
    useHoldProgress({
      holdMs: harmony.holdMs,
      releaseMs: harmony.releaseMs,
      thresholds: harmony.thresholds,
      onThreshold,
      onComplete,
    });

  // Reduced motion gets the finished state immediately — and silently,
  // since there is no user gesture behind it.
  useEffect(() => {
    if (reduce) completeSilently();
  }, [reduce, completeSilently]);

  // Releasing outside the button must still count as a release.
  useEffect(() => {
    if (!holding) return;
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [holding, end]);

  const beginHold = useCallback(
    (event?: React.PointerEvent | React.KeyboardEvent) => {
      if (event?.cancelable) event.preventDefault();
      if (done) return;
      ensure(); // the press itself is the gesture that unlocks audio
      start();
    },
    [done, ensure, start],
  );

  const helpText = done
    ? harmony.help.done
    : holding
      ? harmony.help.holding
      : harmony.help.idle;

  return (
    <div className="grid grid-cols-2 items-center gap-gap-hbox max-dt:grid-cols-1">
      <div>
        <div
          className="flex h-[clamp(150px,20vw,230px)] items-end gap-2.5 max-tb:h-[150px]"
          aria-hidden="true"
        >
          {harmony.keys.map((key, i) => (
            <div
              key={key.caption}
              data-on={lit[i]}
              style={{ height: `${key.heightPct}%` }}
              className={`hkey duration-[550ms] ease-kawai relative flex-1 overflow-hidden rounded-t-lg rounded-b-xl border bg-white/7 transition-[transform,border-color] ${
                lit[i]
                  ? "-translate-y-[14px] border-brand/60"
                  : "border-white/13"
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

        <div className="mt-[30px] flex flex-wrap items-center gap-[18px]">
          <button
            type="button"
            aria-describedby="hold-help"
            onPointerDown={beginHold}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") beginHold(event);
            }}
            onKeyUp={(event) => {
              if (event.key === " " || event.key === "Enter") end();
            }}
            className="rounded-pill duration-500 ease-kawai relative touch-none overflow-hidden border-[1.5px] border-white/42 bg-transparent px-[30px] py-[15px] text-[0.95rem] font-medium text-white transition-colors select-none hover:border-brand-light coarse:min-h-11"
          >
            <motion.span
              aria-hidden="true"
              className="bg-brand absolute inset-0 origin-left"
              style={{ scaleX: progress }}
            />
            <span className="relative z-[2]">{harmony.button}</span>
          </button>

          <div
            id="hold-help"
            aria-live="polite"
            className="text-kicker font-mono tracking-[0.16em] text-on-deep-muted"
          >
            {helpText}
          </div>
        </div>
      </div>

      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:self-center">
        <div
          className={`duration-700 ease-kawai transition-opacity ${
            done ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-idle font-display font-semibold text-on-deep/55">
            {harmony.idle.title}
          </div>
          <p className="mt-3 max-w-[40ch] text-on-deep-faint">
            {harmony.idle.body}
          </p>
        </div>

        <div
          className={`duration-[900ms] ease-kawai transition-[opacity,transform] ${
            done ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="text-payoff font-display font-bold text-white">
            {harmony.payoff.prefix}
            <em className="text-brand-light not-italic">
              {harmony.payoff.emphasis}
            </em>
          </div>
          <p className="mt-3 max-w-[44ch] text-on-deep-muted">
            {harmony.payoff.body}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * A tiny Web Audio synth — no audio files. Each note is a triangle
 * oscillator with a sine an octave above it at a third of the gain,
 * through an exponential attack/decay envelope.
 *
 * `ensure()` MUST be called synchronously from inside a pointer or key
 * handler. Creating or resuming an AudioContext anywhere else (an
 * effect, say) is blocked by autoplay policy — iOS Safari most strictly.
 */
export function useChordSynth() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }, []);

  const playNote = useCallback(
    (freq: number, delay = 0, peak = 0.16, dur = 1.9) => {
      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") return;

      const t = ctx.currentTime + delay;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      const fundamental = ctx.createOscillator();
      fundamental.type = "triangle";
      fundamental.frequency.value = freq;

      const octave = ctx.createOscillator();
      octave.type = "sine";
      octave.frequency.value = freq * 2;

      const octaveGain = ctx.createGain();
      octaveGain.gain.value = 0.3;

      octave.connect(octaveGain);
      octaveGain.connect(gain);
      fundamental.connect(gain);
      gain.connect(ctx.destination);

      fundamental.start(t);
      octave.start(t);
      fundamental.stop(t + dur + 0.06);
      octave.stop(t + dur + 0.06);
    },
    [],
  );

  /** All five notes, 45ms apart — the Cmaj9 arriving as one chord. */
  const playChord = useCallback(
    (freqs: readonly number[]) => {
      freqs.forEach((freq, i) => playNote(freq, i * 0.045, 0.13, 2.6));
    },
    [playNote],
  );

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return { ensure, playNote, playChord };
}

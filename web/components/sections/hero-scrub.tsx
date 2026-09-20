"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { CtaButton } from "@/components/primitives/cta-button";
import { Badge } from "@/components/primitives/pill";
import { SplitWords } from "@/components/primitives/split-words";
import { HeroPicture } from "./hero-picture";
import { hero } from "@/content";
import type { HeroBand } from "@/content/types";

/* ---------------------------- easing ----------------------------- */

/** The draft crossfades bands with a smoothstep, not a linear ramp. */
function smoothstep(p: number, e0: number, e1: number) {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/* ----------------------------- band ------------------------------ */

function Band({
  band,
  index,
  total,
  progress,
  loadK,
}: {
  band: HeroBand;
  index: number;
  total: number;
  progress: MotionValue<number>;
  loadK: MotionValue<number>;
}) {
  const [a, b] = band.range;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Crossfade width at each edge, and the ramp that drives `k`.
  const f = Math.min(0.02, (b - a) / 3);
  const ramp = band.ramp ?? Math.min(0.025, (b - a) * 0.35);

  const opacity = useTransform(progress, (p) => {
    const inEase = isFirst ? 1 : smoothstep(p, a, a + f);
    const outEase = isLast ? 1 : 1 - smoothstep(p, b - f, b);
    return Math.round(inEase * outEase * 1000) / 1000;
  });
  const visibility = useTransform(opacity, (v) =>
    v < 0.01 ? "hidden" : "visible",
  );

  const scrollK = useTransform(progress, [a, a + ramp], [0, 1], {
    clamp: true,
  });
  // Band 0 also animates in on page load, before any scrolling happens.
  const k = useTransform([scrollK, loadK], ([s, l]: number[]) =>
    isFirst ? Math.max(s, l) : s,
  );

  // The halo lifts as the caption arrives (0.3 → 1 across `k`).
  const haloOpacity = useTransform(k, (v) => 0.3 + 0.7 * v);

  return (
    <motion.div
      className={`left-gutter absolute top-1/2 w-[min(520px,44vw)] -translate-y-1/2 ${
        band.interactive ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ opacity, visibility }}
    >
      <motion.div
        className="band-halo"
        style={{ opacity: haloOpacity }}
        aria-hidden="true"
      />

      {band.kicker ? (
        <div className="kicker-rule text-kicker text-brand-ink mb-[18px] flex items-center gap-3 font-mono font-medium tracking-[0.22em] uppercase">
          {band.kicker}
        </div>
      ) : null}

      <BandBody band={band} k={k} />

      {band.badge ? (
        <div className="mt-[26px]">
          <Badge highlight={band.badge.highlight} text={band.badge.text} />
        </div>
      ) : null}

      {band.ctas ? (
        <BandCtas k={k} ctas={band.ctas} />
      ) : null}
    </motion.div>
  );
}

/** The four per-band reveal treatments from the draft. */
function BandBody({ band, k }: { band: HeroBand; k: MotionValue<number> }) {
  const heading = band.heading;
  const sub = band.sub;

  // (a) word-by-word rise
  const subStage2 = useTransform(k, [0.42, 0.42 + 1 / 3.4], [0, 1], {
    clamp: true,
  });
  const subStage2Y = useTransform(subStage2, [0, 1], [14, 0]);

  // (g) approach from depth
  const approachScale = useTransform(k, [0, 1], [0.88, 1]);
  const approachOpacity = useTransform(k, [0, 1 / 1.5], [0, 1], {
    clamp: true,
  });

  // (c) blur to sharp
  const softOpacity = useTransform(k, (v) => 1 - v);

  if (band.effect === "approach") {
    return (
      <motion.div
        className="origin-left"
        style={{ scale: approachScale, opacity: approachOpacity }}
      >
        <p className="text-lead font-display font-semibold">{heading?.text}</p>
        {sub ? (
          <p className="text-sub text-ink-soft mt-[18px] max-w-[34ch]">{sub}</p>
        ) : null}
      </motion.div>
    );
  }

  if (band.effect === "blur-to-sharp") {
    return (
      <>
        <div className="relative">
          <motion.p
            aria-hidden="true"
            className="text-lead font-display absolute inset-0 font-semibold blur-[11px]"
            style={{ opacity: softOpacity }}
          >
            {heading?.text}
          </motion.p>
          <motion.p
            className="text-lead font-display font-semibold"
            style={{ opacity: k }}
          >
            {heading?.text}
          </motion.p>
        </div>
        {sub ? (
          <p className="text-sub text-ink-soft mt-[18px] max-w-[34ch]">{sub}</p>
        ) : null}
      </>
    );
  }

  // 'rise' and 'rise-staged' both split the headline into words; only
  // the staged variant delays the sub-line and CTAs behind it.
  const Heading = heading?.as === "h1" ? motion.h1 : motion.p;

  return (
    <>
      <Heading
        className={
          heading?.as === "h1"
            ? "text-h1"
            : "text-lead font-display font-semibold"
        }
      >
        {heading ? (
          <SplitWords text={heading.text} seed={heading.seed ?? 0} k={k} />
        ) : null}
      </Heading>

      {sub ? (
        band.effect === "rise-staged" ? (
          <motion.p
            className="text-sub text-ink-soft mt-[18px] max-w-[34ch]"
            style={{ opacity: subStage2, y: subStage2Y }}
          >
            {sub}
          </motion.p>
        ) : (
          <p className="text-sub text-ink-soft mt-[18px] max-w-[34ch]">{sub}</p>
        )
      ) : null}
    </>
  );
}

function BandCtas({
  k,
  ctas,
}: {
  k: MotionValue<number>;
  ctas: NonNullable<HeroBand["ctas"]>;
}) {
  const stage3 = useTransform(k, [0.62, 0.62 + 1 / 3.6], [0, 1], {
    clamp: true,
  });
  const stage3Y = useTransform(stage3, [0, 1], [14, 0]);

  return (
    <motion.div
      className="mt-[30px] flex flex-wrap gap-3"
      style={{ opacity: stage3, y: stage3Y }}
    >
      {ctas.map((cta) => (
        <CtaButton key={cta.label} cta={cta} />
      ))}
    </motion.div>
  );
}

/* ----------------------------- hero ------------------------------ */

export default function HeroScrub() {
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Replaces the draft's hand-rolled k=0.16 lerp.
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.0005,
  });

  // The 900ms intro ramp that animates band 0 in on first paint.
  const loadK = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      loadK.set(1);
      return;
    }
    const controls = animate(loadK, 1, { duration: 0.9, ease: "linear" });
    return () => controls.stop();
  }, [loadK, reduce]);

  // Ken Burns on the photo (updateShot in the draft).
  const scale = useTransform(progress, [0, 1], [1, 1.155]);
  const x = useTransform(progress, [0, 1], ["0%", "-3.2%"]);
  const y = useTransform(progress, [0, 1], ["0%", "1.6%"]);
  const cueOpacity = useTransform(progress, (p) => 1 - p * 4);

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label={hero.label}
      className="relative h-[520vh] scrub-off:hidden"
    >
      <div className="bg-panel sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale, x, y }}
        >
          <HeroPicture className="h-full w-full object-cover object-[72%_46%]" />
        </motion.div>

        <div className="hero-veil" aria-hidden="true" />
        <div className="hero-veil-top" aria-hidden="true" />

        <div className="absolute inset-0">
          {hero.bands.map((band, i) => (
            <Band
              key={band.id}
              band={band}
              index={i}
              total={hero.bands.length}
              progress={progress}
              loadK={loadK}
            />
          ))}
        </div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: cueOpacity }}
          className="text-ink-soft left-gutter absolute bottom-[34px] flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.18em] short:hidden"
        >
          <span className="cue-track bg-line-strong relative block h-px w-[34px] overflow-hidden" />
          {hero.scrollCue}
        </motion.div>
      </div>
    </section>
  );
}

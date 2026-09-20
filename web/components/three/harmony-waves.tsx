"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, MathUtils, type Color, type Group } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { MotionValue } from "motion/react";
import { harmony } from "@/content";
import type { ThreeTokens } from "@/lib/three-tokens";
import type { HarmonyLayout } from "./use-harmony-layout";

const POINTS = 96;
/** Spatial frequency of the base note, in cycles per world unit. */
const K = 2.6;
const SPEED = 1.9;
/** C4 — every other note is drawn at its true ratio against this. */
const ROOT_HZ = 261.63;

/** Envelope shape, mirroring the audio: sharp pluck, decay, sustain. */
const SUSTAIN = 0.34;
const DECAY_LAMBDA = 1.1;
const RELEASE_LAMBDA = 3;
const CONVERGE_LAMBDA = 2.2;

const COUNT = harmony.keys.length;

/**
 * Built on three's own Line2 rather than drei's `<Line>`: it's the only
 * drei component this scene ever wanted, and three already ships the
 * same primitive. Fat lines need this — plain `THREE.Line` is stuck at
 * 1px on most platforms, which is far too faint for these.
 */
function createWaveLine(color: Color, lineWidth: number) {
  const geometry = new LineGeometry();
  geometry.setPositions(new Float32Array(POINTS * 3));

  const material = new LineMaterial({
    color,
    linewidth: lineWidth,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const line = new Line2(geometry, material);
  // The geometry is rewritten every frame, so its initial bounding
  // sphere means nothing — without this the wave pops out of view.
  line.frustumCulled = false;
  return line;
}

/**
 * The five notes as visible waves, and the point of the whole scene.
 *
 * Each key emits a wave whose frequency is its real ratio against C4,
 * so what you see corresponds to what you hear. While the notes are
 * separate the waves sit at different depths and heights — you can see
 * that they do not agree. When the fifth lands they converge onto one
 * axis and a sixth wave draws through them: the actual pointwise sum,
 * which is the Cmaj9 waveform. That is the claim the copy makes, shown
 * rather than asserted.
 *
 * Rendered additively in front of the keys, so nothing is occluded and
 * the waves read as emitted light rather than as objects.
 */
export function HarmonyWaves({
  progress,
  done,
  layout,
  tokens,
}: {
  progress: MotionValue<number>;
  done: boolean;
  layout: HarmonyLayout;
  tokens: ThreeTokens;
}) {
  const size = useThree((state) => state.size);
  const groups = useRef<(Group | null)[]>([]);

  /** Per-note amplitude envelopes, and whether each was lit last frame. */
  const envelopes = useRef<number[]>(new Array(COUNT).fill(0));
  const wasOn = useRef<boolean[]>(new Array(COUNT).fill(false));
  const converge = useRef(0);

  const ratios = useMemo(
    () => harmony.keys.map((key) => key.freq / ROOT_HZ),
    [],
  );

  // The five note lines plus the sum line, created once. Lazy state
  // rather than a memo: these are long-lived mutable three objects that
  // render needs to attach, not a derived value. Tokens are read once
  // at mount and never change.
  const [lines] = useState<Line2[]>(() => [
    ...harmony.keys.map(() => createWaveLine(tokens.brand, 2)),
    createWaveLine(tokens.brandLight, 4),
  ]);

  // Reused every frame so the per-frame work allocates nothing. A ref,
  // not a memo, because these are written to rather than derived.
  const buffersRef = useRef<Float32Array[] | null>(null);
  if (buffersRef.current === null) {
    buffersRef.current = Array.from(
      { length: COUNT + 1 },
      () => new Float32Array(POINTS * 3),
    );
  }
  const buffers = buffersRef.current;

  /** Where each wave sits while the notes are still separate. */
  const separated = useMemo(
    () =>
      harmony.keys.map((_, i) => ({
        z: 0.55 + i * 0.16,
        y: (i - (COUNT - 1) / 2) * layout.viewHeight * 0.15,
      })),
    [layout.viewHeight],
  );

  // Fat lines size themselves in pixels, so they need the canvas size.
  useEffect(() => {
    for (const line of lines) {
      line.material.resolution.set(size.width, size.height);
    }
  }, [lines, size.width, size.height]);

  // R3F doesn't own objects handed to <primitive>, so dispose them here.
  useEffect(() => {
    const current = lines;
    return () => {
      for (const line of current) {
        line.geometry.dispose();
        line.material.dispose();
      }
    };
  }, [lines]);

  /* eslint-disable react-hooks/immutability -- `lines` holds three.js
     scene objects, not React state. Rewriting their geometry and
     material each frame is how R3F is meant to be driven; the rule has
     no way to tell these apart from a mutated state value. */
  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const time = state.clock.elapsedTime;
    const p = progress.get();
    const amp = layout.viewHeight * 0.13;

    converge.current = MathUtils.damp(
      converge.current,
      done ? 1 : 0,
      CONVERGE_LAMBDA,
      delta,
    );
    const conv = converge.current;

    for (let i = 0; i < COUNT; i++) {
      const on = p >= harmony.thresholds[i];

      // Crossing the threshold plucks the note; it then decays toward a
      // sustain floor so the wave stays legible while you keep holding.
      if (on && !wasOn.current[i]) envelopes.current[i] = 1;
      wasOn.current[i] = on;

      envelopes.current[i] = on
        ? MathUtils.damp(envelopes.current[i], SUSTAIN, DECAY_LAMBDA, delta)
        : MathUtils.damp(envelopes.current[i], 0, RELEASE_LAMBDA, delta);

      const env = envelopes.current[i];
      const ratio = ratios[i];
      const buffer = buffers[i];

      for (let j = 0; j < POINTS; j++) {
        const x = (j / (POINTS - 1) - 0.5) * layout.viewWidth;
        buffer[j * 3] = x;
        buffer[j * 3 + 1] =
          Math.sin(x * K * ratio + time * SPEED * ratio) * amp * env;
        buffer[j * 3 + 2] = 0;
      }

      lines[i].geometry.setPositions(buffer);
      // Once they converge the five step back to make room for the sum:
      // still visible as its constituents, no longer the subject.
      lines[i].material.opacity = env * 0.85 * (1 - conv * 0.6);

      const group = groups.current[i];
      if (!group) continue;
      group.position.z = MathUtils.lerp(separated[i].z, 0.75, conv);
      group.position.y = MathUtils.lerp(separated[i].y, 0, conv);
    }

    // The sum wave — what the five actually add up to.
    const sum = lines[COUNT];
    const buffer = buffers[COUNT];
    for (let j = 0; j < POINTS; j++) {
      const x = (j / (POINTS - 1) - 0.5) * layout.viewWidth;
      let total = 0;
      for (let i = 0; i < COUNT; i++) {
        total +=
          Math.sin(x * K * ratios[i] + time * SPEED * ratios[i]) *
          envelopes.current[i];
      }
      buffer[j * 3] = x;
      buffer[j * 3 + 1] = (total / COUNT) * amp * 2.6 * conv;
      buffer[j * 3 + 2] = 0;
    }
    sum.geometry.setPositions(buffer);
    sum.material.opacity = conv;
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      {harmony.keys.map((key, i) => (
        <group
          key={key.caption}
          ref={(node) => {
            groups.current[i] = node;
          }}
          position={[0, separated[i].y, separated[i].z]}
        >
          <primitive object={lines[i]} />
        </group>
      ))}

      <group position={[0, 0, 0.78]}>
        <primitive object={lines[COUNT]} />
      </group>
    </>
  );
}

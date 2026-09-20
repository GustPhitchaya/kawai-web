"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils, type Group, type MeshStandardMaterial } from "three";
import type { MotionValue } from "motion/react";
import { harmony } from "@/content";
import type { ThreeTokens } from "@/lib/three-tokens";
import type { HarmonyLayout } from "./use-harmony-layout";

const DEPTH = 0.34;
/** How far a lit key tilts toward the viewer, in radians. */
const TILT = 0.17;
/** A little tilt even at rest, so the key tops always catch light. */
const REST_TILT = 0.05;
/** Exponential damping rate — frame-rate independent via MathUtils.damp. */
const LAMBDA = 7;

/**
 * The five keys.
 *
 * Lit keys rise and tilt toward the viewer rather than depressing: the
 * shapes are bottom-aligned bars of unequal height, so the draft's
 * "rise + brand fill" reads far better on them than a piano press
 * would. The tilt is what the extra dimension buys — you see the top
 * face catch the light as the note lands.
 *
 * Everything here is driven by reading the `progress` MotionValue
 * inside useFrame, so the scene never triggers a React render.
 */
export function HarmonyKeys3D({
  progress,
  layout,
  tokens,
}: {
  progress: MotionValue<number>;
  layout: HarmonyLayout;
  tokens: ThreeTokens;
}) {
  const groups = useRef<(Group | null)[]>([]);
  const materials = useRef<(MeshStandardMaterial | null)[]>([]);
  /** Damped 0..1 "lit" amount per key, driving both tint and glow. */
  const activations = useRef<number[]>(harmony.keys.map(() => 0));

  // The section background is `deep`, so an unlit key painted `deep`
  // would be invisible. Lift it the same way the CSS row used a
  // white/7 wash over the same background.
  const keyColor = useMemo(
    () => new Color().lerpColors(tokens.deep, tokens.onDeep, 0.11),
    [tokens],
  );

  useFrame((_, rawDelta) => {
    // Clamp so a backgrounded tab returning doesn't snap everything.
    const delta = Math.min(rawDelta, 0.1);
    const p = progress.get();

    for (let i = 0; i < harmony.keys.length; i++) {
      const on = p >= harmony.thresholds[i];
      const group = groups.current[i];
      const material = materials.current[i];
      if (!group || !material) continue;

      // Rise is relative to the floor the keys stand on — damping
      // toward a bare `rise` would walk them off their baseline.
      group.position.y = MathUtils.damp(
        group.position.y,
        layout.baseY + (on ? layout.rise : 0),
        LAMBDA,
        delta,
      );
      group.rotation.x = MathUtils.damp(
        group.rotation.x,
        on ? -TILT : -REST_TILT,
        LAMBDA,
        delta,
      );

      // Tint toward the brand rather than flooding emissive: a lit key
      // has to stay a lit *object*, with the directional light still
      // shaping it. Full emissive washes it into a flat red rectangle.
      activations.current[i] = MathUtils.damp(
        activations.current[i],
        on ? 1 : 0,
        LAMBDA,
        delta,
      );
      const activation = activations.current[i];

      material.color.lerpColors(keyColor, tokens.brand, activation * 0.88);
      material.emissiveIntensity = activation * 0.42;
    }
  });

  return (
    <>
      {harmony.keys.map((key, i) => (
        // Outer group animates; inner mesh is offset so the key pivots
        // around its base rather than its centre.
        <group
          key={key.caption}
          ref={(node) => {
            groups.current[i] = node;
          }}
          position={[layout.x[i], layout.baseY, 0]}
        >
          <mesh position={[0, layout.height[i] / 2, 0]}>
            <boxGeometry args={[layout.width, layout.height[i], DEPTH]} />
            <meshStandardMaterial
              ref={(node) => {
                materials.current[i] = node;
              }}
              color={keyColor}
              emissive={tokens.brand}
              emissiveIntensity={0}
              roughness={0.55}
              metalness={0.08}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

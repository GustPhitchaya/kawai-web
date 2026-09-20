"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { readThreeTokens } from "@/lib/three-tokens";
import { HarmonyKeys3D } from "./harmony-keys-3d";
import { HarmonyWaves } from "./harmony-waves";
import { useHarmonyLayout } from "./use-harmony-layout";

interface SceneProps {
  progress: MotionValue<number>;
  done: boolean;
}

function SceneContent({ progress, done }: SceneProps) {
  const layout = useHarmonyLayout();
  // Read once: the design tokens can't change without a reload.
  const tokens = useMemo(() => readThreeTokens(), []);

  return (
    <>
      {/* Kept low so the key lighting produces real contrast — a high
          ambient flattens the bars back into the rectangles the CSS
          fallback already draws. */}
      <ambientLight intensity={0.42} />
      <directionalLight position={[2.6, 3.4, 4]} intensity={1.9} />
      <directionalLight position={[-3.2, 1.2, 2.2]} intensity={0.55} />
      <HarmonyKeys3D progress={progress} layout={layout} tokens={tokens} />
      <HarmonyWaves
        progress={progress}
        done={done}
        layout={layout}
        tokens={tokens}
      />
    </>
  );
}

/**
 * The WebGL replacement for the CSS key row.
 *
 * Only ever mounted by `harmony-interactive.tsx` once the gate passes,
 * which is what keeps three.js out of every other visitor's bundle.
 *
 * `progress` arrives as a MotionValue and is read inside useFrame, so
 * holding the button drives the scene without a single React render.
 */
export default function HarmonyScene({ progress, done }: SceneProps) {
  const [visible, setVisible] = useState(true);

  // Stop the frame loop outright on a hidden tab, the same way
  // motion-provider pauses the site's ambient CSS animation.
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <Canvas
      // Never let the canvas swallow the pointerdown on the hold button:
      // that gesture is what unlocks the AudioContext.
      className="pointer-events-none"
      frameloop={visible ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 30 }}
    >
      <SceneContent progress={progress} done={done} />
    </Canvas>
  );
}

"use client";

import { MotionConfig } from "motion/react";
import { useEffect } from "react";

/**
 * One client boundary that makes every motion component in the tree
 * respect the OS reduced-motion setting, and pauses the ambient CSS
 * animations while the tab is hidden (the draft's `body.paused`).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sync = () => {
      document.body.dataset.paused = String(document.hidden);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

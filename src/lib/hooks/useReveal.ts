"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "./useHydrated";
import { useReducedMotion } from "./useReducedMotion";

export type RevealState<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  /** true เมื่อ element เข้าจอแล้ว */
  revealed: boolean;
  /**
   * true เมื่อ JS พร้อมและอนุญาตให้ซ่อนเนื้อหารอ reveal ได้
   * ถ้า false ห้ามซ่อน — เนื้อหาต้องอ่านได้เสมอ (progressive enhancement)
   */
  armed: boolean;
};

/**
 * เผยเนื้อหาเมื่อ element เข้าจอ แล้ว unobserve ทันที (ไม่เล่นซ้ำตอน scroll ขึ้น)
 * ถ้าอยู่ในจอตั้งแต่แรก IntersectionObserver จะยิงทันทีเองในเฟรมถัดไป
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.25,
): RevealState<T> {
  const ref = useRef<T>(null);
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  const hasIO = hydrated && typeof IntersectionObserver !== "undefined";
  const armed = hasIO && !reduced;

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          setRevealed(true);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, threshold]);

  return { ref, revealed, armed };
}

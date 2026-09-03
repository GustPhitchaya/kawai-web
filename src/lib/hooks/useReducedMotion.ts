"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * ผู้ใช้ตั้งค่า prefers-reduced-motion: reduce หรือไม่
 * ตอน SSR คืน false เสมอเพื่อให้ค่าตรงกับ HTML ที่ส่งมา (ไม่เกิด hydration mismatch)
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

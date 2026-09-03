"use client";

import { useEffect } from "react";

/**
 * เรียก callback ทุกครั้งที่ scroll โดย throttle ด้วย requestAnimationFrame
 * (spec ข้อ 5: scroll listener ทุกตัวต้องผ่าน rAF) — เรียกครั้งแรกตอน mount ด้วย
 *
 * ผู้เรียกควรห่อ callback ด้วย useCallback เพื่อไม่ให้ subscribe ใหม่ทุก render
 */
export function useRafScroll(cb: () => void): void {
  useEffect(() => {
    let ticking = false;
    let raf = 0;

    const frame = () => {
      ticking = false;
      cb();
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [cb]);
}

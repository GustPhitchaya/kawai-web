"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  from: number;
  to: number;
  /** ระยะเวลานับ (ms) */
  duration?: number;
  /** true = เริ่มนับทันทีตอน mount, false = รอจนเข้าจอ */
  immediate?: boolean;
  className?: string;
};

/**
 * ตัวเลขนับขึ้นครั้งเดียวด้วย requestAnimationFrame
 * ค่าที่ render ตอนแรกคือค่าปลายทาง — ถ้า JS ไม่ทำงานก็ยังอ่านเลขที่ถูกต้อง
 */
export function CountUp({
  from,
  to,
  duration = 1200,
  immediate = false,
  className,
}: Props) {
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        // ease-out cubic — เฟรมแรก p≈0 จึงเริ่มที่ค่า from เองโดยไม่ต้อง setState ก่อน
        setValue(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    if (immediate) {
      run();
      return () => cancelAnimationFrame(raf);
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          run();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration, from, immediate, reduced, to]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

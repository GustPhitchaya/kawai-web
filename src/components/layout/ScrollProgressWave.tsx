"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const WIDTH = 1200;
const SEG = 40;

/**
 * แถบความคืบหน้าการ scroll ที่ขอบล่าง navbar — เป็น "เส้นคลื่นเสียง" ไม่ใช่เส้นตรง
 * แอมพลิจูดสูงขึ้นเมื่อ scroll เร็ว และแบนราบลงเมื่อหยุด
 */
export function ScrollProgressWave() {
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let lastY = window.scrollY;
    let amp = 0;
    let raf = 0;
    let running = false;

    const draw = () => {
      const path = pathRef.current;
      if (!path) return;
      const y = window.scrollY;
      const velocity = Math.abs(y - lastY);
      lastY = y;
      // แอมพลิจูดวิ่งเข้าหาค่าเป้าหมายแบบนุ่ม ๆ แล้วค่อยแบนลงเมื่อหยุด scroll
      amp += (Math.min(4, velocity * 0.12) - amp) * 0.25;
      const a = reduced ? 0 : amp;

      const doc = document.documentElement.scrollHeight - window.innerHeight;
      const progress = doc > 0 ? Math.min(1, y / doc) : 0;
      const width = WIDTH * progress;

      let d = "M0 6";
      for (let x = 0; x <= width; x += SEG) {
        d += ` L${x.toFixed(1)} ${(6 + Math.sin(x / 60) * a).toFixed(2)}`;
      }
      path.setAttribute("d", d);

      // เดินเฟรมต่อจนกว่าคลื่นจะแบนสนิท
      if (a > 0.05) {
        running = true;
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
      }
    };

    const onScroll = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    draw();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} 12`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-[3px] w-full"
    >
      <path
        ref={pathRef}
        d="M0 6 L0 6"
        fill="none"
        stroke="#DB2A1B"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

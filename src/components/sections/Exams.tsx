"use client";

import { useCallback, useRef, useState } from "react";
import { EXAM_INTRO, EXAM_LEVELS } from "@/data/exams";
import { useRafScroll } from "@/lib/hooks/useRafScroll";

/* MOCK DATA: รอข้อมูลจริงเรื่องการสอบจาก KAWAI */
export function Exams() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const [lit, setLit] = useState(0);

  // เส้น timeline วาดตัวเองจากบนลงล่างตามตำแหน่ง scroll
  useRafScroll(
    useCallback(() => {
      const box = timelineRef.current;
      const line = lineRef.current;
      if (!box || !line) return;

      const rect = box.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (window.innerHeight * 0.8 - rect.top) / (rect.height * 0.9)),
      );
      line.setAttribute("stroke-dashoffset", String(100 - progress * 100));

      // หมุดสว่างขึ้นเมื่อเส้นวาดมาถึง
      const count = EXAM_LEVELS.filter(
        (_, i) => progress > (i + 0.3) / EXAM_LEVELS.length,
      ).length;
      setLit((prev) => (prev === count ? prev : count));
    }, []),
  );

  return (
    <section id="exam" className="mx-auto max-w-[1240px] px-6 pt-5 pb-24">
      <h2 className="mb-3 font-display text-[clamp(26px,3vw,40px)] font-semibold">
        การสอบวัดระดับ
      </h2>
      <p className="mb-11 max-w-[60ch] text-base leading-[1.8] text-ink/65">
        {EXAM_INTRO}
      </p>

      <div ref={timelineRef} className="relative grid gap-11 pl-15">
        <svg
          viewBox="0 0 4 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute top-2 left-[19px] h-[calc(100%-16px)] w-1"
        >
          <line
            ref={lineRef}
            x1="2"
            y1="0"
            x2="2"
            y2="100"
            stroke="#DB2A1B"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>

        {EXAM_LEVELS.map((level, i) => {
          const on = i < lit;
          return (
            <div key={level.step} className="relative">
              <span
                aria-hidden="true"
                style={{
                  borderColor: on ? "#DB2A1B" : "rgba(15,16,21,.14)",
                  color: on ? "#DB2A1B" : "rgba(15,16,21,.4)",
                  transform: on ? "scale(1.06)" : "none",
                  transitionProperty: "border-color, color, transform",
                  transitionDuration: "var(--dur-base)",
                  transitionTimingFunction: "var(--ease-spring)",
                }}
                className="absolute top-0.5 -left-15 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white font-display text-sm"
              >
                {level.step}
              </span>
              <h3 className="mb-2 font-display text-[22px] font-semibold">
                {level.title}
              </h3>
              <p className="max-w-[62ch] text-[15px] leading-[1.8] text-ink/65">
                {level.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

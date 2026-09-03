"use client";

import { useEffect } from "react";
import { useReveal } from "@/lib/hooks/useReveal";
import { useSound } from "@/lib/sound/SoundContext";

/** "Personality" — แต่ละตัวอักษรน้ำหนัก/เอียงต่างกัน สื่อความหลากหลาย */
const PERSONALITY: { ch: string; weight: number; transform?: string }[] = [
  { ch: "P", weight: 400, transform: "rotate(-3deg)" },
  { ch: "e", weight: 700 },
  { ch: "r", weight: 400, transform: "translateY(-4px)" },
  { ch: "s", weight: 600 },
  { ch: "o", weight: 400, transform: "rotate(4deg)" },
  { ch: "n", weight: 700 },
  { ch: "a", weight: 500, transform: "translateY(3px)" },
  { ch: "l", weight: 400 },
  { ch: "i", weight: 600, transform: "rotate(-2deg)" },
  { ch: "t", weight: 400 },
  { ch: "y", weight: 700 },
];

/** 5 จุด = เด็ก 5 คนที่ต่างกัน — dx/dy คือจุดตั้งต้นก่อนเคลื่อนเข้าหากันเป็นคอร์ด */
const DOTS = [
  { cx: 250, cy: 195, r: 9, fill: "rgb(15,16,21)", dx: -150, dy: -70 },
  { cx: 250, cy: 180, r: 13, fill: "#DB2A1B", dx: 130, dy: 60 },
  { cx: 250, cy: 165, r: 7, fill: "rgb(15,16,21)", dx: -90, dy: 90 },
  { cx: 250, cy: 135, r: 11, fill: "#DB2A1B", dx: 110, dy: -90 },
  { cx: 250, cy: 105, r: 8, fill: "rgb(15,16,21)", dx: -40, dy: -120 },
];

export function Philosophy() {
  const { ref, revealed, armed } = useReveal<HTMLDivElement>(0.35);
  const { engine } = useSound();
  const hidden = armed && !revealed;

  // เล่นคอร์ด C major ตอนที่จุดทั้ง 5 มารวมกันพอดี
  useEffect(() => {
    if (!revealed || !armed) return;
    const t = window.setTimeout(
      () => engine.chord([60, 64, 67, 72], { gain: 0.4, dur: 1.8, stagger: 0.04 }),
      900,
    );
    return () => window.clearTimeout(t);
  }, [armed, engine, revealed]);

  return (
    <section id="about" className="mx-auto max-w-[1240px] px-6 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-5 text-xs tracking-[.22em] text-kawai-red uppercase">
            Our Philosophy
          </div>

          <div className="mb-2 font-display text-[clamp(40px,6vw,84px)] leading-[.98]">
            {PERSONALITY.map((letter, i) => (
              <span
                key={`${letter.ch}-${i}`}
                className="inline-block"
                style={{ fontWeight: letter.weight, transform: letter.transform }}
              >
                {letter.ch}
              </span>
            ))}
          </div>
          {/* "Harmony" — ทุกตัวอักษรน้ำหนักเท่ากัน สื่อความกลมกลืน */}
          <div className="mb-7 font-display text-[clamp(40px,6vw,84px)] leading-none font-medium tracking-[.02em] text-kawai-red">
            Harmony
          </div>

          <p className="mb-4.5 text-[17px] leading-[1.8] text-ink/78">
            เราให้ความใส่ใจกับบุคลิกภาพของเด็ก ๆ ทุกคน เด็กทุกคนมีเอกลักษณ์เฉพาะตัว
            แต่ทุกคนสามารถร่วมกันสร้าง Harmony
            ที่งดงามเมื่อทุกคนได้มาร่วมสร้างเสียงเพลงด้วยกัน
          </p>
          <p className="mb-6.5 text-[15px] leading-[1.85] text-ink/60">
            เป้าหมายของเราไม่เพียงแค่ช่วยให้นักเรียนพัฒนาทักษะและฝีมือในการเล่น
            แต่ยังรวมถึงการบ่มเพาะความเป็นตัวตนของพวกเขา
            ผ่านกิจกรรมการแสดงออกของแต่ละหลักสูตร
            โดยมุ่งหวังให้พัฒนาบุคลิกภาพที่สมบูรณ์ยิ่งขึ้น
          </p>

          <div className="rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl border-l-[3px] border-kawai-red bg-white px-6 py-5 text-[15px] leading-[1.7] shadow-[0_10px_30px_rgba(15,16,21,.05)]">
            ไม่ใช้ซีดีหรือสื่ออิเล็กทรอนิกส์{" "}
            <b>ครูบรรเลงเปียโนสดให้เด็กฟังทุกคาบ</b>
          </div>
        </div>

        <div
          ref={ref}
          className="rounded-3xl bg-white p-9 shadow-[0_20px_60px_rgba(15,16,21,.07)]"
        >
          <svg
            viewBox="0 0 420 300"
            aria-hidden="true"
            className="block h-auto w-full"
          >
            <g stroke="rgba(15,16,21,.14)" strokeWidth="1.5">
              {[90, 120, 150, 180, 210].map((y) => (
                <line key={y} x1="30" y1={y} x2="390" y2={y} />
              ))}
            </g>
            <path
              d="M250 195 L250 105"
              stroke="#DB2A1B"
              strokeWidth="2"
              fill="none"
              strokeDasharray="120"
              style={{
                strokeDashoffset: hidden ? 120 : 0,
                transitionProperty: "stroke-dashoffset",
                transitionDuration: "700ms",
                transitionTimingFunction: "var(--ease-out)",
                transitionDelay: hidden ? "0ms" : "900ms",
              }}
            />
            {DOTS.map((dot, i) => (
              <circle
                key={`${dot.cx}-${dot.cy}`}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill={dot.fill}
                style={{
                  opacity: hidden ? 0.5 : 1,
                  transform: hidden
                    ? `translate(${dot.dx}px,${dot.dy}px)`
                    : "none",
                  transitionProperty: "transform, opacity",
                  transitionDuration: "900ms",
                  transitionTimingFunction: "var(--ease-out)",
                  transitionDelay: hidden ? "0ms" : `${i * 90}ms`,
                }}
              />
            ))}
          </svg>
          <div className="mt-5 text-center text-[13px] text-ink/50">
            จากโน้ตเดี่ยวที่ต่างกัน สู่คอร์ดเดียวกัน
          </div>
        </div>
      </div>
    </section>
  );
}

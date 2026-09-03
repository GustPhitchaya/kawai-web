"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/data/nav";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { CtaButton } from "@/components/ui/CtaButton";
import { CountUp } from "@/components/ui/CountUp";
import { Piano } from "@/components/piano/Piano";

/** headline เข้าทีละคำ — คำว่า "ผ่าน" มาช้ากว่าคำอื่นเพื่อสร้างจังหวะ */
const HEADLINE_WORDS: { text: string; late?: boolean; accent?: boolean }[] = [
  { text: "ไม่ใช่แค่การเรียนดนตรี" },
  { text: "แต่เป็นการเรียนรู้" },
  { text: "‘ผ่าน’", late: true, accent: true },
  { text: "เสียงดนตรี" },
];

export function Hero() {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // เริ่ม stagger หลัง hydrate — HTML ที่ส่งมาจาก server แสดง headline เต็มอยู่แล้ว
    // ถ้า JS ไม่ทำงาน headline จึงไม่มีทางค้างที่ opacity 0
    const t = window.setTimeout(() => setEntered(true), 20);
    return () => window.clearTimeout(t);
  }, []);

  const hidden = hydrated && !reduced && !entered;

  return (
    <section
      id="home"
      className="relative mx-auto grid max-w-[1240px] items-center gap-14 overflow-hidden px-6 pt-24 pb-22 md:pt-[150px] md:pb-[90px] lg:grid-cols-[1.02fr_.98fr]"
    >
      {/* คลื่นเสียงพื้นหลัง — เบามากจนแทบไม่รู้สึก */}
      <svg
        viewBox="0 0 2400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[8%] h-[300px] w-[200%] opacity-[.07] motion-safe:animate-[kwDrift_34s_linear_infinite]"
      >
        <path
          d="M0 150 Q150 40 300 150 T600 150 T900 150 T1200 150 T1500 150 T1800 150 T2100 150 T2400 150"
          fill="none"
          stroke="#DB2A1B"
          strokeWidth="3"
        />
        <path
          d="M0 190 Q200 90 400 190 T800 190 T1200 190 T1600 190 T2000 190 T2400 190"
          fill="none"
          stroke="rgb(15,16,21)"
          strokeWidth="2"
        />
      </svg>

      <div className="relative z-2">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-ink/8 bg-white px-4 py-2 text-[13px] text-ink/70">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-kawai-red"
          />
          ก่อตั้งที่ประเทศญี่ปุ่น ปี{" "}
          <b className="font-display text-ink">
            <CountUp from={1900} to={1956} immediate />
          </b>
        </div>

        <h1 className="mb-5.5 font-display text-[clamp(34px,4.4vw,60px)] leading-[1.16] font-semibold tracking-[-.01em]">
          {HEADLINE_WORDS.map((word, i) => (
            <span key={word.text}>
              <span
                className="inline-block"
                style={{
                  opacity: hidden ? 0 : 1,
                  transform: hidden ? "translateY(14px)" : "none",
                  color: word.accent ? "#DB2A1B" : undefined,
                  transitionProperty: "opacity, transform",
                  transitionDuration: "500ms",
                  transitionTimingFunction: "var(--ease-out)",
                  transitionDelay: `${120 + i * 50 + (word.late ? 220 : 0)}ms`,
                }}
              >
                {word.text}
              </span>{" "}
            </span>
          ))}
        </h1>

        <p className="mb-8 max-w-[52ch] text-[17px] leading-[1.75] text-ink/72">
          <b className="font-display font-semibold text-ink">
            Personality &amp; Harmony
          </b>{" "}
          — เด็กทุกคนมีเอกลักษณ์เฉพาะตัว แต่ทุกคนสร้าง Harmony
          ที่งดงามร่วมกันได้ เมื่อได้มาบรรเลงเสียงเพลงด้วยกัน
        </p>

        <div className="flex flex-wrap gap-3">
          <CtaButton href={CONTACT.lineUrl}>
            จองคลาสเรียนทดลองผ่าน LINE
          </CtaButton>
          <CtaButton href="#courses" variant="secondary">
            ดูคอร์สเรียนทั้งหมด
          </CtaButton>
        </div>
      </div>

      <div className="relative z-2">
        <Piano />
      </div>
    </section>
  );
}

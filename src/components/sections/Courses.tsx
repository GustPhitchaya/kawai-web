"use client";

import Image from "next/image";
import { useState } from "react";
import { AGE_FILTERS, COURSES, type AgeKey } from "@/data/courses";
import { INSTRUMENTS, INSTRUMENT_BLURB, type InstrumentId } from "@/data/instruments";
import { useReveal } from "@/lib/hooks/useReveal";
import { useSound } from "@/lib/sound/SoundContext";

/** เส้นคลื่นเสียงที่วิ่งผ่านขอบบนการ์ดตอน hover */
function CardWave() {
  return (
    <svg
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        transitionDuration: "var(--dur-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
      className="absolute top-0 left-0 z-2 h-2 w-full opacity-0 transition-opacity group-hover:opacity-100"
    >
      <path
        d="M0 6 Q25 0 50 6 T100 6 T150 6 T200 6 T250 6 T300 6 T350 6 T400 6"
        fill="none"
        stroke="#DB2A1B"
        strokeWidth="2"
      />
    </svg>
  );
}

const INSTRUMENT_ICONS: Record<InstrumentId, React.ReactNode> = {
  piano: (
    <>
      <rect x="6" y="10" width="28" height="20" rx="3" fill="none" stroke="rgb(15,16,21)" strokeWidth="2" />
      <line x1="15" y1="10" x2="15" y2="24" stroke="#DB2A1B" strokeWidth="2" />
      <line x1="25" y1="10" x2="25" y2="24" stroke="#DB2A1B" strokeWidth="2" />
    </>
  ),
  voice: (
    <>
      <rect x="16" y="6" width="8" height="16" rx="4" fill="none" stroke="rgb(15,16,21)" strokeWidth="2" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="#DB2A1B" strokeWidth="2" />
    </>
  ),
  drums: (
    <>
      <circle cx="20" cy="22" r="12" fill="none" stroke="rgb(15,16,21)" strokeWidth="2" />
      <line x1="12" y1="10" x2="28" y2="16" stroke="#DB2A1B" strokeWidth="2" />
    </>
  ),
  guitar: (
    <>
      <circle cx="18" cy="26" r="9" fill="none" stroke="rgb(15,16,21)" strokeWidth="2" />
      <line x1="24" y1="20" x2="33" y2="8" stroke="#DB2A1B" strokeWidth="2" />
    </>
  ),
  violin: (
    <>
      <circle cx="16" cy="24" r="8" fill="none" stroke="rgb(15,16,21)" strokeWidth="2" />
      <line x1="8" y1="32" x2="32" y2="8" stroke="#DB2A1B" strokeWidth="2" />
    </>
  ),
  dance: (
    <>
      <circle cx="20" cy="11" r="5" fill="none" stroke="rgb(15,16,21)" strokeWidth="2" />
      <line x1="20" y1="16" x2="14" y2="32" stroke="#DB2A1B" strokeWidth="2" />
      <line x1="20" y1="16" x2="28" y2="30" stroke="#DB2A1B" strokeWidth="2" />
    </>
  ),
};

export function Courses() {
  const { engine } = useSound();
  const [filter, setFilter] = useState<AgeKey | "all">("all");
  const [pressed, setPressed] = useState<InstrumentId | null>(null);
  const { ref, revealed, armed } = useReveal<HTMLDivElement>(0.15);
  const hidden = armed && !revealed;

  const onFilter = (value: AgeKey | "all") => {
    setFilter(value);
    engine.marimba();
  };

  const onInstrument = (id: InstrumentId) => {
    engine.playInstrument(id);
    setPressed(id);
    window.setTimeout(() => setPressed((cur) => (cur === id ? null : cur)), 320);
  };

  return (
    <section id="courses" className="mx-auto max-w-[1240px] px-6 pt-5 pb-24">
      <div className="mb-8 flex flex-wrap items-end gap-5">
        <h2 className="font-display text-[clamp(26px,3vw,40px)] font-semibold">
          คอร์สเรียน
        </h2>
        <div
          role="group"
          aria-label="กรองคอร์สตามช่วงอายุ"
          className="flex flex-wrap gap-2 md:ml-auto"
        >
          {AGE_FILTERS.map((f) => {
            const on = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={on}
                onClick={() => onFilter(f.value)}
                style={{
                  transitionProperty: "background-color, color, border-color",
                  transitionDuration: "var(--dur-fast)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                className={`cursor-pointer rounded-full border px-4 py-2.5 text-[13px] ${
                  on
                    ? "border-kawai-red bg-kawai-red text-white"
                    : "border-ink/15 bg-white text-ink hover:border-kawai-red"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={ref} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course, i) => {
          const match = filter === "all" || course.age === filter;
          return (
            <article
              key={course.id}
              onMouseEnter={() => engine.ui(course.note)}
              style={{
                // reveal: clip-path เผยจากล่าง stagger 80ms
                clipPath: hidden ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
                // filter: การ์ดที่ไม่ตรงเงื่อนไขจางลงและย่อลง (ไม่ใช้ display:none)
                opacity: hidden ? 0 : match ? 1 : 0.32,
                transform: match ? "none" : "scale(.96)",
                transitionProperty: "clip-path, opacity, transform",
                transitionDuration: "700ms, 500ms, var(--dur-base)",
                transitionTimingFunction: "var(--ease-out)",
                transitionDelay: hidden ? "0ms" : `${i * 80}ms`,
              }}
              className="group relative overflow-hidden rounded-[20px] bg-white p-7 shadow-[0_10px_30px_rgba(15,16,21,.05)]"
            >
              <CardWave />
              <div className="relative -mx-7 -mt-7 mb-5.5 h-43 overflow-hidden rounded-t-[20px]">
                <Image
                  src={course.image}
                  alt={course.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="mb-3 text-xs tracking-[.14em] text-kawai-red uppercase">
                {course.ageLabel}
              </div>
              <h3 className="mb-1 font-display text-[21px] font-semibold">
                {course.name}
              </h3>
              <div className="mb-5 text-sm text-ink/50">{course.nameTh}</div>
              <dl className="mb-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-ink/45">รูปแบบ</dt>
                <dd className="m-0">{course.format}</dd>
                <dt className="text-ink/45">ครู</dt>
                <dd className="m-0">{course.teachers}</dd>
                <dt className="text-ink/45">ต่อคาบ</dt>
                <dd className="m-0">{course.perSession}</dd>
                <dt className="text-ink/45">ระยะเวลา</dt>
                <dd className="m-0">{course.duration}</dd>
              </dl>
              <p className="text-sm leading-[1.8] text-ink/65">
                {course.description}
              </p>
            </article>
          );
        })}

        <article
          style={{
            clipPath: hidden ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
            opacity: hidden ? 0 : 1,
            transitionProperty: "clip-path, opacity",
            transitionDuration: "700ms, 500ms",
            transitionTimingFunction: "var(--ease-out)",
            transitionDelay: hidden ? "0ms" : `${COURSES.length * 80}ms`,
          }}
          className="flex flex-col justify-center gap-3.5 rounded-[20px] bg-ink p-7 text-white"
        >
          <h3 className="font-display text-[21px] font-semibold">
            หลักสูตรเครื่องดนตรี
          </h3>
          <p className="text-sm leading-[1.8] text-white/70">
            {INSTRUMENT_BLURB}
          </p>
          <div className="text-[13px] text-white/55">
            กดไอคอนด้านล่างเพื่อฟังเสียง
          </div>
        </article>
      </div>

      {/* ของเล่นชิ้นที่สองของหน้า — กดแล้วได้ยินเสียงเครื่องดนตรีนั้นจริง ๆ */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            type="button"
            onClick={() => onInstrument(inst.id)}
            style={{
              transform:
                pressed === inst.id ? "translateY(-6px) scale(1.05)" : "none",
              transitionProperty: "transform, border-color",
              transitionDuration: "var(--dur-base), var(--dur-fast)",
              transitionTimingFunction: "var(--ease-spring), var(--ease-out)",
            }}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-ink/10 bg-white px-3 py-5.5 text-sm hover:border-kawai-red"
          >
            <svg viewBox="0 0 40 40" aria-hidden="true" className="h-7.5 w-7.5">
              {INSTRUMENT_ICONS[inst.id]}
            </svg>
            {inst.label}
          </button>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/data/testimonials";
import { useSound } from "@/lib/sound/SoundContext";

const AUTOPLAY_MS = 6000;
const COUNT = TESTIMONIALS.length;

/* MOCK DATA: รีวิวสมมติ รอคำรีวิวจริงจากผู้ปกครอง */
export function Testimonials() {
  const { engine } = useSound();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  // ผู้ใช้กดเลื่อนเอง = หยุด autoplay ถาวร (ห้ามแย่ง control จากผู้ใช้)
  const [stopped, setStopped] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number, manual: boolean) => {
      setSlide(((index % COUNT) + COUNT) % COUNT);
      if (manual) {
        setStopped(true);
        engine.marimba();
      }
    },
    [engine],
  );

  useEffect(() => {
    if (paused || stopped) return;
    const t = window.setInterval(
      () => setSlide((s) => (s + 1) % COUNT),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(t);
  }, [paused, stopped]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(slide + 1, true);
    if (e.key === "ArrowLeft") goTo(slide - 1, true);
  };

  return (
    <section id="reviews" className="mx-auto max-w-[1240px] px-6 py-24">
      <h2 className="mb-10 font-display text-[clamp(26px,3vw,40px)] font-semibold">
        เสียงจากผู้ปกครอง
      </h2>

      <div
        role="region"
        aria-label="รีวิวจากผู้ปกครอง"
        aria-roledescription="carousel"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={onKeyDown}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start == null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 50) goTo(slide + (dx < 0 ? 1 : -1), true);
        }}
        className="relative overflow-hidden rounded-3xl bg-white px-10 py-12 shadow-[0_20px_60px_rgba(15,16,21,.06)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2.5 left-6 font-display text-[180px] leading-none text-kawai-red/8"
        >
          ”
        </span>

        <div className="relative z-2 overflow-hidden">
          <div
            style={{
              transform: `translateX(${-slide * 100}%)`,
              transitionProperty: "transform",
              transitionDuration: "500ms",
              transitionTimingFunction: "var(--ease-out)",
            }}
            className="flex"
          >
            {TESTIMONIALS.map((item, i) => (
              <div
                key={item.id}
                className="min-w-full"
                aria-hidden={i !== slide}
                inert={i !== slide}
              >
                <p className="mb-7 max-w-[44ch] text-[clamp(18px,2vw,24px)] leading-[1.75]">
                  {item.quote}
                </p>
                <div className="flex items-center gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-kawai-red/10 font-display font-semibold text-kawai-red"
                  >
                    {item.initials}
                  </span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-[13px] text-ink/50">{item.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-2 mt-9 flex items-center gap-4">
          <div className="flex gap-2">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`รีวิวที่ ${i + 1}`}
                aria-current={i === slide}
                onClick={() => goTo(i, true)}
                style={{
                  transitionProperty: "width, background-color",
                  transitionDuration: "var(--dur-base)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                className={`h-2 cursor-pointer rounded-full border-none p-0 ${
                  i === slide ? "w-6.5 bg-kawai-red" : "w-2 bg-ink/18"
                }`}
              />
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              aria-label="รีวิวก่อนหน้า"
              onClick={() => goTo(slide - 1, true)}
              style={{
                transitionProperty: "border-color, transform",
                transitionDuration: "var(--dur-fast)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              className="h-10.5 w-10.5 cursor-pointer rounded-full border border-ink/15 bg-white text-base hover:-translate-x-0.5 hover:border-kawai-red"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="รีวิวถัดไป"
              onClick={() => goTo(slide + 1, true)}
              style={{
                transitionProperty: "border-color, transform",
                transitionDuration: "var(--dur-fast)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              className="h-10.5 w-10.5 cursor-pointer rounded-full border border-ink/15 bg-white text-base hover:translate-x-0.5 hover:border-kawai-red"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

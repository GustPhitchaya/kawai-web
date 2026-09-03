"use client";

import { useEffect, useState } from "react";
import { useSound } from "@/lib/sound/SoundContext";

/**
 * ปุ่มเปิด/ปิดเสียง + hint ข้าง ๆ
 * hint จางหายเองใน 6 วินาที หรือหายทันทีเมื่อผู้ใช้กดปุ่ม
 */
export function SoundToggle() {
  const { soundOn, toggle } = useSound();
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setHintVisible(false), 6000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden={!hintVisible || undefined}
        style={{
          opacity: hintVisible && !soundOn ? 1 : 0,
          transitionDuration: "var(--dur-slow)",
          transitionTimingFunction: "var(--ease-out)",
        }}
        className="hidden text-xs whitespace-nowrap text-ink/55 transition-opacity xl:inline"
      >
        เปิดเสียงเพื่อสัมผัสประสบการณ์เต็มรูปแบบ
      </span>
      <button
        type="button"
        onClick={() => {
          setHintVisible(false);
          toggle();
        }}
        aria-label="เปิดหรือปิดเสียงของเว็บไซต์"
        aria-pressed={soundOn}
        style={{
          transitionDuration: "var(--dur-fast)",
          transitionTimingFunction: "var(--ease-spring)",
        }}
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-white text-base transition-[transform,border-color] hover:scale-[1.08] hover:border-kawai-red"
      >
        <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
      </button>
    </div>
  );
}

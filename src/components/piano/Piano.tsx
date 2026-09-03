"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSound } from "@/lib/sound/SoundContext";

type KeyDef = { midi: number; kbd?: string; optional?: boolean; left?: string };

/** คีย์ขาว 8 คีย์ — 2 คีย์ท้ายซ่อนบนจอเล็ก (เหลือ 6 คีย์) */
const WHITE_KEYS: KeyDef[] = [
  { midi: 60, kbd: "a" },
  { midi: 62, kbd: "s" },
  { midi: 64, kbd: "d" },
  { midi: 65, kbd: "f" },
  { midi: 67, kbd: "g" },
  { midi: 69, kbd: "h" },
  { midi: 71, kbd: "j", optional: true },
  { midi: 72, kbd: "k", optional: true },
];

/**
 * คีย์ดำวางคร่อมรอยต่อระหว่างคีย์ขาว — ตำแหน่งเป็น % จึงต้องมี 2 ชุด
 * เพราะจอเล็กเหลือคีย์ขาว 6 คีย์ (รอยต่ออยู่คนละที่กับตอน 8 คีย์)
 */
const BLACK_KEYS: (KeyDef & {
  /** ตำแหน่งตอนมีคีย์ขาว 6 คีย์ (จอเล็ก) */
  leftSm: string;
  /** ตำแหน่งตอนมีคีย์ขาว 8 คีย์ (จอใหญ่) */
  leftMd: string;
  label: string;
})[] = [
  { midi: 61, leftSm: "16.67%", leftMd: "12.5%", label: "โน้ต C ชาร์ป" },
  { midi: 63, leftSm: "33.33%", leftMd: "25%", label: "โน้ต D ชาร์ป" },
  { midi: 66, leftSm: "66.67%", leftMd: "50%", label: "โน้ต F ชาร์ป" },
  { midi: 68, leftSm: "83.33%", leftMd: "62.5%", label: "โน้ต G ชาร์ป" },
  {
    midi: 70,
    leftSm: "100%",
    leftMd: "75%",
    label: "โน้ต A ชาร์ป",
    optional: true,
  },
];

/** คีย์ที่กระพริบเป็นใบ้ว่ากดได้ — หยุดทันทีที่ผู้ใช้กดครั้งแรก */
const HINT_MIDI = 64;

const KEYBOARD_MAP: Record<string, number> = {
  a: 60,
  s: 62,
  d: 64,
  f: 65,
  g: 67,
  h: 69,
  j: 71,
  k: 72,
};

export function Piano() {
  const { soundOn, engine, reduced } = useSound();
  const wrapRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const tipShownRef = useRef(false);

  /** วงคลื่นเสียงขยายออกจากคีย์แล้วจางหาย */
  const ripple = useCallback((x: number, y: number) => {
    const host = wrapRef.current;
    if (!host) return;
    const r = document.createElement("span");
    r.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:60px;height:60px;border-radius:999px;border:2px solid #DB2A1B;pointer-events:none;animation:kwRipple 900ms var(--ease-out) forwards`;
    host.appendChild(r);
    window.setTimeout(() => r.remove(), 1200);
  }, []);

  /** ตัวโน้ตลอยขึ้นแล้วจางหาย */
  const floatNote = useCallback((x: number) => {
    const host = wrapRef.current;
    if (!host) return;
    const s = document.createElement("span");
    s.textContent = "♪";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = `position:absolute;left:${x}px;top:0;font-size:26px;color:#DB2A1B;pointer-events:none;animation:kwFloat 2s var(--ease-out) forwards`;
    host.appendChild(s);
    window.setTimeout(() => s.remove(), 2100);
  }, []);

  const pressKey = useCallback(
    (el: HTMLButtonElement) => {
      const midi = Number(el.dataset.midi);
      const isBlack = el.dataset.black === "true";

      setPlayed(true);

      // ยังปิดเสียงอยู่ → บอกใบ้ครั้งเดียว ไม่รบกวนซ้ำ
      if (!soundOn && !tipShownRef.current) {
        tipShownRef.current = true;
        setShowTip(true);
        window.setTimeout(() => setShowTip(false), 3500);
      }

      engine.playNote(midi, { gain: 0.95, dur: 1.6 });

      el.style.transform = "translateY(3px)";
      el.style.boxShadow = isBlack
        ? "inset 0 0 14px rgba(219,42,27,.9)"
        : "0 0 0 1px #DB2A1B, inset 0 -18px 26px rgba(219,42,27,.28)";
      window.setTimeout(() => {
        el.style.transform = "";
        el.style.boxShadow = "";
      }, 170);

      if (reduced) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const kr = el.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      const x = kr.left - wr.left + kr.width / 2;
      ripple(x, kr.top - wr.top + kr.height * 0.75);
      floatNote(x);
    },
    [engine, floatNote, reduced, ripple, soundOn],
  );

  // รองรับคีย์บอร์ดจริง A S D F G H J K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const midi = KEYBOARD_MAP[e.key.toLowerCase()];
      if (midi == null) return;
      const el = keysRef.current?.querySelector<HTMLButtonElement>(
        `[data-midi="${midi}"]`,
      );
      // offsetParent เป็น null แปลว่าคีย์นั้นถูกซ่อนอยู่บนจอเล็ก
      if (!el || el.offsetParent === null) return;
      e.preventDefault();
      pressKey(el);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  const keyHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      pressKey(e.currentTarget);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      pressKey(e.currentTarget);
    },
  };

  return (
    <div
      ref={wrapRef}
      className="relative rounded-3xl bg-white px-[22px] pt-[26px] pb-[22px] shadow-[0_26px_70px_rgba(15,16,21,.10)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs tracking-[.16em] text-ink/45 uppercase">
          Play me
        </span>
        <span className="text-xs text-ink/45">A S D F G H J K</span>
      </div>

      <div
        ref={keysRef}
        className="relative flex h-45 gap-1.5 [touch-action:manipulation]"
      >
        {WHITE_KEYS.map((k) => (
          <button
            key={k.midi}
            type="button"
            data-midi={k.midi}
            aria-label={`เล่นโน้ต ปุ่ม ${k.kbd?.toUpperCase()}`}
            {...keyHandlers}
            style={{
              animation:
                !reduced && !played && k.midi === HINT_MIDI
                  ? "kwBlink 2.6s var(--ease-out) infinite"
                  : undefined,
              transitionProperty: "transform, box-shadow",
              transitionDuration: "90ms",
              transitionTimingFunction: "var(--ease-out)",
            }}
            className={`min-w-0 flex-1 cursor-pointer rounded-t-md rounded-b-[10px] border border-b-4 border-ink/12 bg-linear-to-b from-white to-[#f2f2f4] ${
              k.optional ? "hidden md:block" : ""
            }`}
          />
        ))}

        <div className="pointer-events-none absolute inset-0">
          {BLACK_KEYS.map((k) => (
            <button
              key={k.midi}
              type="button"
              data-midi={k.midi}
              data-black="true"
              tabIndex={-1}
              aria-label={k.label}
              {...keyHandlers}
              style={{
                "--l-sm": k.leftSm,
                "--l-md": k.leftMd,
                transitionProperty: "transform, box-shadow",
                transitionDuration: "90ms",
                transitionTimingFunction: "var(--ease-out)",
              } as React.CSSProperties}
              className={`pointer-events-auto absolute top-0 left-[calc(var(--l-sm)-4%)] h-[60%] w-[8%] cursor-pointer rounded-b-[5px] border-none bg-linear-to-b from-[#2a2b31] to-[#0f1015] md:left-[calc(var(--l-md)-3%)] md:w-[6%] ${
                k.optional ? "hidden md:block" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-ink/55">
        <span aria-hidden="true" className="text-kawai-red">
          ↑
        </span>
        ลองกดดูสิ
        <span
          role="status"
          style={{
            opacity: showTip ? 1 : 0,
            transitionDuration: "var(--dur-base)",
            transitionTimingFunction: "var(--ease-out)",
          }}
          className="ml-auto text-xs text-kawai-red transition-opacity"
        >
          {showTip ? "เปิดเสียงเพื่อฟัง 🔊" : ""}
        </span>
      </div>
    </div>
  );
}

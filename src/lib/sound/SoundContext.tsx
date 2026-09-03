"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SoundEngine } from "./SoundEngine";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type SoundApi = {
  soundOn: boolean;
  toggle: () => void;
  engine: SoundEngine;
  reduced: boolean;
};

const SoundCtx = createContext<SoundApi | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundOn, setSoundOn] = useState(false);
  const reduced = useReducedMotion();
  // engine ตัวเดียวตลอดอายุหน้า — ยังไม่สร้าง AudioContext จนกว่าจะกดเปิดเสียง
  const [engine] = useState(() => new SoundEngine());

  useEffect(() => {
    engine.setReduced(reduced);
  }, [engine, reduced]);

  useEffect(() => () => engine.dispose(), [engine]);

  const toggle = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      engine.setEnabled(next);
      if (next) {
        engine.unlock();
        // คอร์ด C major สั้น ๆ ยืนยันว่าเสียงทำงาน
        engine.chord([60, 64, 67], { gain: 0.5, dur: 1.4, stagger: 0.05 });
      }
      return next;
    });
  }, [engine]);

  const value = useMemo<SoundApi>(
    () => ({ soundOn, toggle, engine, reduced }),
    [soundOn, toggle, engine, reduced],
  );

  return <SoundCtx.Provider value={value}>{children}</SoundCtx.Provider>;
}

export function useSound(): SoundApi {
  const ctx = useContext(SoundCtx);
  if (!ctx) throw new Error("useSound ต้องอยู่ภายใน <SoundProvider>");
  return ctx;
}

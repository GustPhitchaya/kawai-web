import type { HarmonyContent } from "./types";

/**
 * The five keys spell a Cmaj9 (C4 E4 G4 B4 D5). `thresholds` are the
 * hold-progress points at which each key lights and sounds, and
 * `holdMs` / `releaseMs` are the fill and decay durations — all lifted
 * from the draft's hold-to-build interaction.
 */
export const harmony = {
  id: "harmony",
  head: {
    kicker: "ลองด้วยตัวเอง",
    heading: "กดค้างไว้ แล้วฟังเสียงที่เกิดขึ้น",
    lead: "เด็กห้าคน เสียงห้าเสียง กดค้างไว้จนครบ แล้วฟังว่าเสียงที่ต่างกันรวมกันเป็นอะไร เปิดลำโพงไว้ด้วยนะครับ",
  },
  keys: [
    { caption: "คนที่ 1", heightPct: 56, freq: 261.63 },
    { caption: "คนที่ 2", heightPct: 70, freq: 329.63 },
    { caption: "คนที่ 3", heightPct: 100, freq: 392.0 },
    { caption: "คนที่ 4", heightPct: 78, freq: 493.88 },
    { caption: "คนที่ 5", heightPct: 62, freq: 587.33 },
  ],
  thresholds: [0.14, 0.32, 0.5, 0.68, 0.88],
  holdMs: 1800,
  releaseMs: 1100,
  button: "กดค้างไว้",
  help: {
    idle: "กดค้างประมาณสองวินาที เปิดเสียงด้วยจะดีที่สุด",
    holding: "กดค้างไว้ต่อ",
    done: "ครบห้าเสียงแล้ว",
  },
  idle: {
    title: "ห้าเสียงกำลังรออยู่",
    body: "กดค้างไว้ที่ปุ่มด้านซ้าย แล้วดูว่าเกิดอะไรขึ้น",
  },
  payoff: {
    prefix: "ห้าเสียงที่ต่างกัน กลายเป็น ",
    emphasis: "Harmony",
    body: "นี่คือสิ่งที่เกิดขึ้นในห้องเรียนของเราทุกคาบ ไม่มีใครต้องเล่นเหมือนกัน แต่ทุกคนเล่นด้วยกันได้",
  },
} satisfies HarmonyContent;

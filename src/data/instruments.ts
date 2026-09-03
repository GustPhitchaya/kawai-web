/** เครื่องดนตรี 6 ชนิดที่เปิดสอน — แต่ละชิ้นมีเสียงประจำตัวของตัวเอง */
export type InstrumentId =
  | "piano"
  | "voice"
  | "drums"
  | "guitar"
  | "violin"
  | "dance";

export type Instrument = { id: InstrumentId; label: string };

export const INSTRUMENTS: Instrument[] = [
  { id: "piano", label: "เปียโน/คีย์บอร์ด" },
  { id: "voice", label: "ขับร้อง" },
  { id: "drums", label: "กลอง" },
  { id: "guitar", label: "กีตาร์" },
  { id: "violin", label: "ไวโอลิน" },
  { id: "dance", label: "แดนซ์" },
];

export const INSTRUMENT_BLURB =
  "เครื่องดนตรีที่เปิดสอน: เปียโน/คีย์บอร์ด, ขับร้อง, กลอง, กีตาร์, ไวโอลิน, แดนซ์ — ปรับเนื้อหาให้เหมาะกับระดับฝีมือและแนวเพลงที่ผู้เรียนชื่นชอบ";

/** Pentatonic on D — there is no wrong note in it, which is what makes the
 *  page safe for a five-year-old to mash. Index 0 is the lowest degree. */
export const SCALE = [
  146.83, 164.81, 185.0, 220.0, 246.94,
  293.66, 329.63, 369.99, 440.0, 493.88,
  587.33, 659.25, 739.99,
] as const

export const NOTE_NAMES = [
  'D3', 'E3', 'F#3', 'A3', 'B3', 'D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5',
] as const

export const BPM = 92
export const STEPS = 16
export const STEP_DUR = 60 / BPM / 2

export type InstrumentId = 'piano' | 'violin' | 'guitar' | 'drums' | 'voice' | 'dance'

export interface Instrument {
  id: InstrumentId
  th: string
  en: string
  hex: string
  col: [number, number, number]
  gain: number
  /** step index → index into SCALE */
  steps?: Record<number, number>
  kick?: number[]
  snare?: number[]
  hat?: number[]
  clap?: number[]
  sweep?: number[]
  glyph: string
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'piano', th: 'เปียโน', en: 'Piano', hex: '#F0503A', col: [0.94, 0.31, 0.22], gain: 0.5,
    steps: { 0: 10, 2: 8, 3: 12, 6: 11, 8: 12, 10: 7, 11: 9, 14: 10 },
    glyph:
      '<rect x="4" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 7v8.5M13 7v8.5M17 7v8.5" stroke="currentColor" stroke-width="1.8"/>',
  },
  {
    id: 'violin', th: 'ไวโอลิน', en: 'Violin', hex: '#5B8DEF', col: [0.36, 0.55, 0.94], gain: 0.2,
    steps: { 0: 8, 8: 9 },
    glyph:
      '<path d="M13 3c-4 0-6 3.4-6 6.7 0 2.7 1.4 4 1.4 6S6 18.4 6 21s3.4 4 7 4 7-1.4 7-4-2.4-3.4-2.4-5.3 1.4-3.3 1.4-6C19 6.4 17 3 13 3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13 8.5v9.5" stroke="currentColor" stroke-width="1.8"/>',
  },
  {
    id: 'guitar', th: 'กีตาร์', en: 'Guitar', hex: '#F5A93C', col: [0.96, 0.66, 0.24], gain: 0.34,
    steps: { 1: 5, 5: 7, 7: 8, 9: 6, 13: 5, 15: 9 },
    glyph:
      '<circle cx="13" cy="17" r="6.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="13" cy="17" r="2" fill="currentColor"/><path d="M13 10.6V3M9.6 4.6h6.8" stroke="currentColor" stroke-width="1.8"/>',
  },
  {
    id: 'drums', th: 'กลอง', en: 'Drums', hex: '#EF6DA8', col: [0.94, 0.43, 0.66], gain: 0.62,
    kick: [0, 6, 8, 14], snare: [4, 12], hat: [1, 3, 5, 7, 9, 11, 13, 15],
    glyph:
      '<ellipse cx="13" cy="9.5" rx="9" ry="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 9.5v6.5c0 2 4 3.4 9 3.4s9-1.4 9-3.4V9.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  },
  {
    id: 'voice', th: 'ขับร้อง', en: 'Voice', hex: '#52C98A', col: [0.32, 0.79, 0.54], gain: 0.17,
    steps: { 0: 5, 8: 7 },
    glyph:
      '<circle cx="10" cy="13" r="4.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M17 9c1.4 1.4 2.1 2.7 2.1 4s-.7 2.7-2.1 4M20.5 6c2 2 3 4 3 7s-1 5-3 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
  {
    id: 'dance', th: 'แดนซ์', en: 'Dance', hex: '#45C6D6', col: [0.27, 0.78, 0.84], gain: 0.4,
    clap: [2, 6, 10, 14], sweep: [0],
    glyph:
      '<circle cx="13" cy="5.5" r="2.8" fill="currentColor"/><path d="M13 8.3v7M13 15.3l-4.2 7M13 15.3l4.2 7M7.4 11.2l5.6 1.4 5.6-1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
]

export const PLAY_KEYS = [
  { k: 'A', n: 5 }, { k: 'S', n: 6 }, { k: 'D', n: 7 }, { k: 'F', n: 8 },
  { k: 'G', n: 9 }, { k: 'H', n: 10 }, { k: 'J', n: 11 }, { k: 'K', n: 12 },
] as const

export interface Course {
  /** upper bound of the age band this course serves */
  max: number
  name: string
  th: string
  age: string
  hex: string
  facts: [string, string][]
  why: string
}

export const COURSES: Course[] = [
  {
    max: 1, name: 'Coo Chan Land', th: 'คูจังแลนด์', age: '1 ปี', hex: '#F0503A',
    facts: [['รูปแบบ', 'กลุ่ม 2–4 คน'], ['ครูผู้สอน', '2 ท่าน'], ['ต่อคาบ', '40 นาที'], ['ระยะเวลาคอร์ส', '6 เดือน–1 ปี']],
    why: 'การฟังดนตรีและการตอบสนองต่อดนตรีช่วยพัฒนาความไวต่อเสียง ซึ่งเป็นรากฐานของการเรียนรู้ภาษาและจินตนาการ',
  },
  {
    max: 2, name: 'Kulu Kulu Club', th: 'คูลูคูลูคลับ', age: '2 ปี', hex: '#F5A93C',
    facts: [['รูปแบบ', 'กลุ่ม 2–4 คน'], ['ครูผู้สอน', '2 ท่าน'], ['ต่อคาบ', '50 นาที'], ['ระยะเวลาคอร์ส', '6 เดือน–1 ปี']],
    why: 'กิจกรรมยูริธมิกส์ที่ให้เด็กเคลื่อนไหวไปกับเสียงดนตรี ช่วยพัฒนาการรับรู้จังหวะผ่านร่างกายทั้งตัว',
  },
  {
    max: 3, name: 'Hello Music', th: 'เฮลโหลมิวสิก', age: '3 ปี', hex: '#EF6DA8',
    facts: [['รูปแบบ', 'เดี่ยว + กลุ่ม'], ['ครูผู้สอน', '1–2 ท่าน'], ['ต่อคาบ', '30 นาที (เดี่ยว) / 50 นาที (กลุ่ม)']],
    why: 'ช่วงวัยที่เริ่มเชื่อมเสียงที่ได้ยินเข้ากับการเล่นด้วยตัวเอง ผสมทั้งการเรียนเดี่ยวและการเล่นร่วมกับเพื่อน',
  },
  {
    max: 5, name: 'Sound Tree', th: 'ซาวด์ทรี', age: '4–5 ปี', hex: '#52C98A',
    facts: [['รูปแบบ', 'เรียนเดี่ยว'], ['ครูผู้สอน', '1 ท่าน'], ['ต่อคาบ', '30 นาที']],
    why: 'เริ่มเรียนเดี่ยวอย่างจริงจัง วางพื้นฐานการอ่านโน้ต การวางมือ และวินัยการฝึกซ้อม',
  },
  {
    max: 17, name: 'หลักสูตรเครื่องดนตรี', th: 'Instrument Courses', age: '6 ปีขึ้นไป', hex: '#5B8DEF',
    facts: [['เครื่องดนตรี', 'เปียโน / คีย์บอร์ด / ขับร้อง'], ['', 'กลอง / กีตาร์ / ไวโอลิน / แดนซ์'], ['รูปแบบ', 'ปรับตามระดับฝีมือ']],
    why: 'ปรับเนื้อหาให้เหมาะกับระดับฝีมือและแนวเพลงที่ผู้เรียนชื่นชอบ เลือกเครื่องดนตรีที่อยากเล่นได้เอง',
  },
  {
    max: 99, name: 'Sound Fans', th: 'ซาวด์แฟนส์', age: 'ผู้ใหญ่', hex: '#45C6D6',
    facts: [['รูปแบบ', 'เรียนเดี่ยว'], ['เหมาะกับ', 'ผู้เริ่มต้นและผู้ที่เคยเรียนมาก่อน']],
    why: 'สำหรับผู้ใหญ่ที่อยากเริ่มเล่นดนตรี หรือกลับมาเล่นอีกครั้ง เรียนตามจังหวะชีวิตของตัวเอง',
  },
]

export const BRANCHES: [string, string][] = [
  ['CentralwOrld ชั้น 6 โซน Genius Planet · ถ.ราชดำริ ปทุมวัน', 'กรุงเทพฯ'],
  ['Central Chaengwattana ชั้น 8', 'กรุงเทพฯ'],
  ['Central Bangna ชั้น 5', 'กรุงเทพฯ'],
  ['Central Rama 3 ชั้น 7', 'กรุงเทพฯ'],
  ['Central EastVille ชั้น 2', 'กรุงเทพฯ'],
  ['Central Westgate ชั้น G · บางใหญ่', 'นนทบุรี'],
  ['Central Rama 2 · บางขุนเทียน', 'กรุงเทพฯ'],
  ['Central Plaza Mahachai', 'สมุทรสาคร'],
  ['Future Park Rangsit', 'ปทุมธานี'],
  ['Central Chiang Mai ชั้น 3', 'เชียงใหม่'],
  ['Central Chonburi ชั้น 3', 'ชลบุรี'],
  ['Central Si Racha ชั้น 3', 'ชลบุรี'],
]

export const PHONE = '064 226 5945'
export const PHONE_HREF = 'tel:0642265945'

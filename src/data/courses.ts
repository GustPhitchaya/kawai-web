/** คอร์สเรียนทั้งหมด — ข้อมูลจริงจาก KAWAI (ห้ามแต่งเพิ่ม) */

/** ค่าที่ใช้กรองตามช่วงอายุ ต้องตรงกับ AGE_FILTERS ด้านล่าง */
export type AgeKey = "1" | "2" | "3" | "4" | "adult";

export type Course = {
  id: string;
  /** ชื่อภาษาอังกฤษ */
  name: string;
  /** ชื่อทับศัพท์ภาษาไทย */
  nameTh: string;
  /** ป้ายช่วงอายุที่แสดงบนการ์ด */
  ageLabel: string;
  age: AgeKey;
  /** โน้ต MIDI ที่เล่นตอน hover การ์ด — ไล่จากต่ำ (เด็กเล็ก) ไปสูง (ผู้ใหญ่) */
  note: number;
  image: string;
  imageAlt: string;
  format: string;
  teachers: string;
  perSession: string;
  duration: string;
  description: string;
};

export const COURSES: Course[] = [
  {
    id: "coo-chan-land",
    name: "Coo Chan Land",
    nameTh: "คูจังแลนด์",
    ageLabel: "อายุ 1 ปี",
    age: "1",
    note: 60,
    image: "/images/course_1.jpg",
    imageAlt: "บรรยากาศคลาส Coo Chan Land",
    format: "กลุ่ม 2–4 คน",
    teachers: "2 ท่าน",
    perSession: "40 นาที",
    duration: "6 เดือน–1 ปี",
    description:
      "การฟังดนตรีและการตอบสนองต่อดนตรีช่วยพัฒนาความไวต่อเสียง เป็นรากฐานของการเรียนรู้ภาษาและจินตนาการ",
  },
  {
    id: "kulu-kulu-club",
    name: "Kulu Kulu Club",
    nameTh: "คูลูคูลูคลับ",
    ageLabel: "อายุ 2 ปี",
    age: "2",
    note: 62,
    image: "/images/course_2.jpg",
    imageAlt: "บรรยากาศคลาส Kulu Kulu Club",
    format: "กลุ่ม 2–4 คน",
    teachers: "2 ท่าน",
    perSession: "50 นาที",
    duration: "6 เดือน–1 ปี",
    description:
      "เน้นกิจกรรมยูริธมิกส์ ให้เด็กสัมผัสดนตรีด้วยร่างกายทั้งตัว ผ่านอุปกรณ์การสอนที่หลากหลาย",
  },
  {
    id: "hello-music",
    name: "Hello Music",
    nameTh: "เฮลโหลมิวสิก",
    ageLabel: "อายุ 3 ปี",
    age: "3",
    note: 64,
    image: "/images/course_3.jpg",
    imageAlt: "บรรยากาศคลาส Hello Music",
    format: "เดี่ยว + กลุ่ม (กลุ่มมี 2 ครู, 2–4 คน)",
    teachers: "1–2 ท่าน",
    perSession: "30 นาที (เดี่ยว) / 50 นาที (กลุ่ม)",
    duration: "—",
    description:
      "นักเรียนได้คีย์บอร์ดเป็นของตัวเอง เรียนเล่นรวมวง ฝึกทักษะเอนเซมเบิล และอ่านโน้ต (โซลเฟจ) ในรูปแบบที่สนุก",
  },
  {
    id: "sound-tree",
    name: "Sound Tree",
    nameTh: "ซาวด์ทรี",
    ageLabel: "อายุ 4 ปี",
    age: "4",
    note: 67,
    image: "/images/course_4.jpg",
    imageAlt: "บรรยากาศคลาส Sound Tree",
    format: "เรียนเดี่ยว",
    teachers: "1 ท่าน",
    perSession: "30 นาที",
    duration: "—",
    description:
      "วิธีสอนที่พัฒนาจากประสบการณ์สอนกลุ่มกว่า 60 ปีของคาไว ผสานกับงานวิจัยด้านการสอนเปียโน",
  },
  {
    id: "sound-fans",
    name: "Sound Fans",
    nameTh: "ซาวด์แฟนส์",
    ageLabel: "ผู้ใหญ่",
    age: "adult",
    note: 72,
    image: "/images/course_5.jpg",
    imageAlt: "บรรยากาศคลาส Sound Fans",
    format: "เรียนเดี่ยว",
    teachers: "—",
    perSession: "—",
    duration: "—",
    description:
      "สำหรับผู้เริ่มต้น เรียนเพลงที่ชอบตามระดับและเป้าหมายของตัวเอง ผ่านการร้อง เล่น ฟัง และจดจำ",
  },
];

export const AGE_FILTERS: { value: AgeKey | "all"; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "1", label: "1 ปี" },
  { value: "2", label: "2 ปี" },
  { value: "3", label: "3 ปี" },
  { value: "4", label: "4 ปี" },
  { value: "adult", label: "ผู้ใหญ่" },
];

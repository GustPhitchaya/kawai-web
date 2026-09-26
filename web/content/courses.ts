import { lineCta, siteConfig } from "./site";
import type { Course, InstrumentBlock, SectionHeadContent } from "./types";

export const coursesHead = {
  kicker: "Courses",
  heading: "ห้าเส้นทาง ตั้งแต่ขวบแรกจนถึงวัยผู้ใหญ่",
  lead: "ทุกคอร์สเริ่มจากอายุและพัฒนาการของผู้เรียน ไม่ใช่จากบทเพลงที่ต้องเล่นให้จบ",
} satisfies SectionHeadContent;

const CTA_LABEL = "สอบถามคอร์สนี้";

export const courses = [
  {
    slug: "coo-chan-land",
    ageLabel: "อายุ 1 ปี",
    title: "Coo Chan Land",
    titleTh: "คูจังแลนด์",
    description:
      "การฟังดนตรีและการตอบสนองต่อดนตรีช่วยพัฒนาความไวต่อเสียง เป็นรากฐานของการเรียนรู้ภาษาและจินตนาการ",
    specs: [
      { kind: "format", text: "กลุ่ม 2 ถึง 4 คน" },
      { kind: "teachers", text: "ครู 2 ท่าน" },
      { kind: "length", text: "40 นาทีต่อคาบ" },
      // @todo confirm: course length, or the children's age range?
      { kind: "duration", text: "6 เดือนถึง 1 ปี" },
    ],
    image: {
      src: "/images/course-1.jpg",
      alt: "ห้องเรียนกลุ่มเด็กเล็กกับครูและผู้ปกครอง",
      width: 400,
      height: 280,
    },
    ctaHref: "#contact",
    ctaLabel: CTA_LABEL,
  },
  {
    slug: "kulu-kulu-club",
    ageLabel: "อายุ 2 ปี",
    title: "Kulu Kulu Club",
    titleTh: "คูลูคูลูคลับ",
    description:
      "เน้นกิจกรรมยูริธมิกส์ ให้เด็กสัมผัสดนตรีด้วยร่างกายทั้งตัว ผ่านอุปกรณ์การสอนที่หลากหลาย",
    specs: [
      { kind: "format", text: "กลุ่ม 2 ถึง 4 คน" },
      { kind: "teachers", text: "ครู 2 ท่าน" },
      { kind: "length", text: "50 นาทีต่อคาบ" },
      // @todo confirm: course length, or the children's age range?
      { kind: "duration", text: "6 เดือนถึง 1 ปี" },
    ],
    image: {
      src: "/images/course-2.jpg",
      alt: "ห้องแกรนด์เปียโน เด็กเล็กและผู้ปกครองนั่งล้อมวงกับครู",
      width: 400,
      height: 280,
    },
    ctaHref: "#contact",
    ctaLabel: CTA_LABEL,
  },
  {
    slug: "hello-music",
    ageLabel: "อายุ 3 ปี",
    title: "Hello Music",
    titleTh: "เฮลโหลมิวสิก",
    description:
      "นักเรียนได้คีย์บอร์ดเป็นของตัวเอง เรียนเล่นรวมวง ฝึกทักษะเอนเซมเบิล และอ่านโน้ตในรูปแบบที่สนุก",
    specs: [
      { kind: "format", text: "เดี่ยวและกลุ่ม" },
      { kind: "teachers", text: "ครู 1 ถึง 2 ท่าน" },
      { kind: "length", text: "เดี่ยว 30 นาที · กลุ่ม 50 นาที" },
    ],
    image: {
      src: "/images/course-3.jpg",
      alt: "เด็กหญิงเล่นเครื่องเคาะจังหวะกับครู",
      width: 400,
      height: 280,
    },
    ctaHref: "#contact",
    ctaLabel: CTA_LABEL,
  },
  {
    slug: "sound-tree",
    ageLabel: "อายุ 4 ปี",
    title: "Sound Tree",
    titleTh: "ซาวด์ทรี",
    description:
      "วิธีสอนที่พัฒนาจากประสบการณ์สอนกลุ่มกว่า 60 ปีของคาไว ผสานกับงานวิจัยด้านการสอนเปียโน",
    specs: [
      { kind: "format", text: "เรียนเดี่ยว" },
      { kind: "teachers", text: "ครู 1 ท่าน" },
      { kind: "length", text: "30 นาทีต่อคาบ" },
    ],
    image: {
      src: "/images/course-4.jpg",
      alt: "เด็กชายเรียนเปียโนเดี่ยวกับครู",
      width: 400,
      height: 280,
    },
    ctaHref: "#contact",
    ctaLabel: CTA_LABEL,
  },
  {
    slug: "sound-fans",
    ageLabel: "ผู้ใหญ่",
    title: "Sound Fans",
    titleTh: "ซาวด์แฟนส์",
    description:
      "สำหรับผู้เริ่มต้น เรียนเพลงที่ชอบตามระดับและเป้าหมายของตัวเอง ผ่านการร้อง เล่น ฟัง และจดจำ",
    specs: [
      { kind: "format", text: "เรียนเดี่ยว" },
      { kind: "repertoire", text: "เลือกเพลงเองได้" },
    ],
    image: {
      src: "/images/course-5.jpg",
      alt: "ผู้ใหญ่เรียนเปียโนกับครูที่แกรนด์เปียโน KAWAI",
      width: 400,
      height: 280,
    },
    ctaHref: "#contact",
    ctaLabel: CTA_LABEL,
  },
] satisfies Course[];

export const instruments = {
  title: "หลักสูตรเครื่องดนตรี",
  body: "ปรับเนื้อหาให้เหมาะกับระดับฝีมือและแนวเพลงที่ผู้เรียนชื่นชอบ",
  chips: ["เปียโนและคีย์บอร์ด", "ขับร้อง", "กลอง", "กีตาร์", "ไวโอลิน", "แดนซ์"],
  cta: {
    label: lineCta.courses,
    href: siteConfig.line.url,
    variant: "brand",
    external: true,
  },
} satisfies InstrumentBlock;

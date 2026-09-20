import type { EventItem, SectionHeadContent } from "./types";

/** @mock ตารางอีเวนท์ยังเป็นตัวอย่าง — ใช้ตารางจริงก่อน launch */
export const IS_MOCK = true;

export const eventsHead = {
  kicker: "Events",
  heading: "เวทีที่เด็กได้ยืนเอง",
} satisfies SectionHeadContent;

export const events = [
  {
    slug: "music-recital",
    when: "ธันวาคม ทุกปี",
    title: "KAWAI Music Recital",
    body: "เวทีให้นักเรียนทุกคนได้ขึ้นแสดงเดี่ยวหรือร่วมวงต่อหน้าครอบครัวและเพื่อน เพื่อสร้างความมั่นใจและภาคภูมิใจในตัวเอง",
    image: {
      src: "/images/event-1.jpg",
      alt: "เด็กชายบรรเลงแกรนด์เปียโนบนเวทีคอนเสิร์ตต่อหน้าผู้ชม",
      width: 1400,
      height: 782,
    },
  },
  {
    slug: "parent-workshop",
    when: "จัดเป็นระยะตลอดปี",
    title: "Workshop สำหรับผู้ปกครองและเด็ก",
    body: "กิจกรรมสัมผัสดนตรีร่วมกันระหว่างผู้ปกครองและเด็กเล็ก ก่อนตัดสินใจสมัครเรียนจริง",
    image: {
      src: "/images/event-2.jpg",
      alt: "พ่อแม่และลูกเล่นคีย์บอร์ดด้วยกันบนเบาะรองนั่งในห้องกิจกรรม",
      width: 1400,
      height: 782,
    },
  },
  {
    slug: "music-camp",
    when: "เมษายน และ ตุลาคม",
    title: "Music Camp ปิดเทอม",
    body: "ค่ายดนตรีช่วงปิดเทอม รวมกิจกรรมร้อง เล่น เต้น และเวิร์กช็อปเครื่องดนตรีหลากหลายชนิด",
    image: {
      src: "/images/event-3.jpg",
      alt: "เด็ก ๆ ในเสื้อค่าย KAWAI Music Camp ตีกลองด้วยกันกลางแจ้ง",
      width: 1400,
      height: 670,
    },
  },
] satisfies EventItem[];

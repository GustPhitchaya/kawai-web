/* MOCK DATA: รอข้อมูลอีเวนท์จริงจาก KAWAI */

export type EventItem = {
  id: string;
  period: string;
  title: string;
  description: string;
  /** gradient ของ placeholder ที่กวาดผ่านเหมือนไฟเวทีตอน hover */
  sweep: string;
};

export const EVENTS: EventItem[] = [
  {
    id: "recital",
    period: "ธันวาคม (ทุกปี)",
    title: "KAWAI Music Recital",
    description:
      "เวทีให้นักเรียนทุกคนได้ขึ้นแสดงเดี่ยวหรือร่วมวงต่อหน้าครอบครัวและเพื่อน ๆ เพื่อสร้างความมั่นใจและภาคภูมิใจในตัวเอง",
    sweep:
      "linear-gradient(90deg,rgba(219,42,27,0) 0%,rgba(219,42,27,.55) 45%,rgba(255,255,255,.16) 60%,rgba(219,42,27,0) 100%)",
  },
  {
    id: "workshop",
    period: "จัดเป็นระยะตลอดปี",
    title: "Workshop สำหรับผู้ปกครองและเด็ก",
    description:
      "กิจกรรมสัมผัสดนตรีร่วมกันระหว่างผู้ปกครองและเด็กเล็ก ก่อนตัดสินใจสมัครเรียนจริง",
    sweep:
      "linear-gradient(90deg,rgba(219,42,27,0) 0%,rgba(219,42,27,.5) 40%,rgba(255,255,255,.14) 58%,rgba(219,42,27,0) 100%)",
  },
  {
    id: "camp",
    period: "เมษายน / ตุลาคม",
    title: "Music Camp ปิดเทอม",
    description:
      "ค่ายดนตรีช่วงปิดเทอม รวมกิจกรรมร้อง เล่น เต้น และเวิร์กช็อปเครื่องดนตรีหลากหลายชนิด",
    sweep:
      "linear-gradient(90deg,rgba(219,42,27,0) 0%,rgba(219,42,27,.45) 38%,rgba(255,255,255,.18) 62%,rgba(219,42,27,0) 100%)",
  },
];

/** เมนูหลัก — id ตรงกับ id ของ <section> ที่หน้าเดียวกัน (anchor link + scroll spy) */
export type NavItem = { id: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "หน้าแรก" },
  { id: "about", label: "เกี่ยวกับเรา" },
  { id: "courses", label: "คอร์สเรียน" },
  { id: "exam", label: "การสอบ" },
  { id: "events", label: "อีเวนท์" },
  { id: "reviews", label: "รีวิว" },
  { id: "branches", label: "สาขา" },
  { id: "contact", label: "ติดต่อเรา" },
];

/** ลิงก์ในฟุตเตอร์ (ไม่มี "หน้าแรก") */
export const FOOTER_LINKS: NavItem[] = [
  { id: "about", label: "เกี่ยวกับเรา" },
  { id: "courses", label: "คอร์สเรียน" },
  { id: "exam", label: "การสอบ" },
  { id: "events", label: "อีเวนท์" },
  { id: "reviews", label: "รีวิว" },
  { id: "branches", label: "สาขา" },
  { id: "contact", label: "ติดต่อ" },
];

/** ข้อมูลติดต่อจริงของ KAWAI Thailand */
export const CONTACT = {
  lineUrl: "https://page.line.me/kawaiofficial",
  lineId: "@kawaiofficial",
  tel: "064 226 5945",
  telHref: "tel:0642265945",
  email: "Kawaithailand@gmail.com",
  facebook: "https://facebook.com/kawaimusicschoolTH",
  facebookHandle: "kawaimusicschoolTH",
  instagram: "https://instagram.com/kawaimusicschool_th",
  instagramHandle: "kawaimusicschool_th",
} as const;

import { contactWays, lineCta, siteConfig } from "./site";
import type { ContactContent } from "./types";

export const contact = {
  id: "contact",
  head: {
    kicker: "Contact",
    heading: "พร้อมเริ่มต้นเส้นทางดนตรีไปกับ KAWAI แล้วหรือยัง",
    lead: "ทักมาทางไลน์เร็วที่สุด เจ้าหน้าที่ตอบทุกวันในเวลาทำการ",
  },
  lineBlock: {
    tag: "ช่องทางที่เร็วที่สุด",
    heading: "ทักไลน์เพื่อจองคลาสเรียนทดลอง",
    body: "บอกอายุของลูกและสาขาที่สะดวก เราจะจัดวันและส่งรายละเอียดค่าเรียนให้ครบ",
    cta: {
      label: lineCta.contact,
      href: siteConfig.line.url,
      variant: "brand",
      external: true,
    },
  },
  waysTitle: "ช่องทางอื่น",
  ways: contactWays,
  waysNote:
    "หรือเดินเข้ามาที่สาขาไหนก็ได้ใน 12 สาขา เจ้าหน้าที่พาชมห้องเรียนและแนะนำคอร์สที่เหมาะกับลูกให้",
} satisfies ContactContent;

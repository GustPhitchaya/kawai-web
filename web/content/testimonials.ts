import type { SectionHeadContent, Testimonial } from "./types";

/** @mock รีวิวยังเป็นตัวอย่าง — ใช้คำพูดจริงของผู้ปกครองก่อน launch */
export const IS_MOCK = true;

export const testimonialsHead = {
  kicker: "Parents",
  heading: "เสียงจากผู้ปกครอง",
} satisfies SectionHeadContent;

export const testimonials = [
  {
    id: "ploy",
    quote:
      "ตั้งแต่พาน้องมาเรียนที่ KAWAI น้องกล้าแสดงออกมากขึ้น สนุกกับการไปเรียนทุกครั้ง ครูใจดีและสอนสนุกมากค่ะ",
    author: "คุณแม่น้องพลอย",
    role: "ผู้ปกครองนักเรียนคอร์ส Hello Music",
  },
  {
    id: "phum",
    quote:
      "ชอบที่โรงเรียนเน้นความเป็นตัวของตัวเองของเด็กแต่ละคน ไม่กดดันเรื่องการแข่งขัน ทำให้ลูกผมรักการเล่นเปียโนจริง ๆ",
    author: "คุณพ่อน้องภูมิ",
    role: "ผู้ปกครองนักเรียนคอร์ส Sound Tree",
  },
  {
    id: "khaohom",
    quote:
      "ประทับใจกิจกรรมยูริธมิกส์มากค่ะ น้องได้ขยับตัวไปกับดนตรี พัฒนาการทั้งด้านร่างกายและความมั่นใจดีขึ้นเห็นได้ชัด",
    author: "คุณแม่น้องข้าวหอม",
    role: "ผู้ปกครองนักเรียนคอร์ส Kulu Kulu Club",
  },
] satisfies Testimonial[];

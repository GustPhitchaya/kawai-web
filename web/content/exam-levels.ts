import type { ExamContent } from "./types";

/** @mock ข้อมูลการสอบยังเป็นตัวอย่าง — ใช้ข้อมูลจริงจาก KAWAI ก่อน launch */
export const IS_MOCK = true;

export const exam = {
  id: "exam",
  head: {
    kicker: "Examination",
    heading: "วัดระดับได้ โดยไม่ต้องแข่งกับใคร",
    lead: "การสอบของเราวัดพัฒนาการของนักเรียนเทียบกับตัวเขาเองเมื่อหกเดือนก่อน ไม่ใช่เทียบกับเพื่อนในห้อง",
  },
  levels: [
    {
      level: "Level 01",
      title: "Basic",
      body: "สำหรับนักเรียนที่เริ่มต้น เน้นพื้นฐานจังหวะ การฟัง และการอ่านโน้ตเบื้องต้น",
    },
    {
      level: "Level 02",
      title: "Intermediate",
      body: "ประเมินทักษะการเล่นเพลงที่ซับซ้อนขึ้น และการเล่นร่วมกับผู้อื่น",
    },
    {
      level: "Level 03",
      title: "Advanced",
      body: "วัดความสามารถในการตีความเพลงและแสดงออกทางดนตรีอย่างเป็นตัวของตัวเอง",
    },
  ],
  note: "จัดสอบปีละ 2 ครั้ง กลางปีและปลายปี นักเรียนที่ผ่านจะได้รับใบประกาศนียบัตรจาก KAWAI",
} satisfies ExamContent;

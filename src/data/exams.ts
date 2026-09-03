/* MOCK DATA: รอข้อมูลจริงเรื่องการสอบจาก KAWAI */

export type ExamLevel = { step: string; title: string; description: string };

export const EXAM_INTRO =
  "นักเรียนมีโอกาสประเมินพัฒนาการผ่านการสอบวัดระดับตามช่วงเวลา จัดสอบปีละ 2 ครั้ง (กลางปีและปลายปี) นักเรียนที่ผ่านได้รับใบประกาศนียบัตรจาก KAWAI";

export const EXAM_LEVELS: ExamLevel[] = [
  {
    step: "01",
    title: "ระดับ Basic",
    description:
      "สำหรับนักเรียนที่เริ่มต้น เน้นพื้นฐานจังหวะ การฟัง และการอ่านโน้ตเบื้องต้น",
  },
  {
    step: "02",
    title: "ระดับ Intermediate",
    description:
      "ประเมินทักษะการเล่นเพลงที่ซับซ้อนขึ้น และการเล่นร่วมกับผู้อื่น (ensemble)",
  },
  {
    step: "03",
    title: "ระดับ Advanced",
    description:
      "วัดความสามารถในการตีความเพลงและแสดงออกทางดนตรีอย่างเป็นตัวของตัวเอง",
  },
];

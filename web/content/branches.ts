import type { BranchGroup, SectionHeadContent } from "./types";

export const branchesHead = {
  kicker: "Branches",
  heading: "12 สาขาทั่วประเทศ",
  lead: "เลือกสาขาที่ใกล้บ้านที่สุด แล้วทักมาทางไลน์เพื่อนัดวันทดลองเรียน",
} satisfies SectionHeadContent;

/**
 * @todo Seven branches have a floor but no area, and three have an
 * area but no floor — see the table in the README. Fill the gaps here
 * rather than in the component; the card already leaves room for both.
 */
export const branchGroups = [
  {
    id: "bangkok",
    region: "กรุงเทพฯ และปริมณฑล",
    branches: [
      {
        slug: "centralworld",
        name: "CentralwOrld",
        floor: "ชั้น 6",
        area: "ปทุมวัน กรุงเทพฯ",
      },
      {
        slug: "central-chaengwattana",
        name: "Central Chaengwattana",
        floor: "ชั้น 8",
        area: "ปากเกร็ด นนทบุรี",
      },
      {
        slug: "central-bangna",
        name: "Central Bangna",
        floor: "ชั้น 5",
        area: "บางนา กรุงเทพฯ",
      },
      {
        slug: "central-rama-3",
        name: "Central Rama 3",
        floor: "ชั้น 7",
        area: "ยานนาวา กรุงเทพฯ",
      },
      {
        slug: "central-eastville",
        name: "Central EastVille",
        floor: "ชั้น 2",
        area: "ลาดพร้าว กรุงเทพฯ",
      },
      {
        slug: "central-westgate",
        name: "Central Westgate",
        floor: "ชั้น G",
        area: "บางใหญ่ นนทบุรี",
      },
      {
        slug: "central-rama-2",
        name: "Central Rama 2",
        floor: "ชั้น 3",
        area: "บางขุนเทียน กรุงเทพฯ",
      },
      {
        slug: "central-plaza-mahachai",
        name: "Central Plaza Mahachai",
        floor: "ชั้น 2",
        area: "สมุทรสาคร",
      },
      {
        slug: "future-park-rangsit",
        name: "Future Park Rangsit",
        floor: "ชั้น 3",
        area: "ธัญบุรี ปทุมธานี",
      },
    ],
  },
  {
    id: "north",
    region: "ภาคเหนือ",
    branches: [
      {
        slug: "central-chiang-mai",
        name: "Central Chiang Mai",
        floor: "ชั้น 3",
        area: "เชียงใหม่",
      },
    ],
  },
  {
    id: "east",
    region: "ภาคตะวันออก",
    branches: [
      { slug: "central-chonburi", name: "Central Chonburi", floor: "ชั้น 3", area: "ชลบุรี" },
      { slug: "central-si-racha", name: "Central Si Racha", floor: "ชั้น 3", area: "ศรีราชา ชลบุรี" },
    ],
  },
] satisfies BranchGroup[];

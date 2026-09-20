import type { BranchGroup, SectionHeadContent } from "./types";

export const branchesHead = {
  kicker: "Branches",
  heading: "12 สาขาทั่วประเทศ",
  lead: "เลือกสาขาที่ใกล้บ้านที่สุด แล้วทักมาทางไลน์เพื่อนัดวันทดลองเรียน",
} satisfies SectionHeadContent;

export const branchGroups = [
  {
    id: "bangkok",
    region: "กรุงเทพฯ และปริมณฑล",
    columns: 3,
    branches: [
      {
        slug: "centralworld",
        name: "CentralwOrld",
        detail: "ชั้น 6 โซน Genius Planet ถนนราชดำริ ปทุมวัน กรุงเทพฯ",
      },
      {
        slug: "central-chaengwattana",
        name: "Central Chaengwattana",
        detail: "ชั้น 8",
      },
      { slug: "central-bangna", name: "Central Bangna", detail: "ชั้น 5" },
      { slug: "central-rama-3", name: "Central Rama 3", detail: "ชั้น 7" },
      { slug: "central-eastville", name: "Central EastVille", detail: "ชั้น 2" },
      {
        slug: "central-westgate",
        name: "Central Westgate",
        detail: "ชั้น G บางใหญ่ นนทบุรี",
      },
      {
        slug: "central-rama-2",
        name: "Central Rama 2",
        detail: "บางขุนเทียน กรุงเทพฯ",
      },
      {
        slug: "central-plaza-mahachai",
        name: "Central Plaza Mahachai",
        detail: "สมุทรสาคร",
      },
      {
        slug: "future-park-rangsit",
        name: "Future Park Rangsit",
        detail: "ปทุมธานี",
      },
    ],
  },
  {
    id: "north",
    region: "ภาคเหนือ",
    columns: 1,
    branches: [
      { slug: "central-chiang-mai", name: "Central Chiang Mai", detail: "ชั้น 3" },
    ],
  },
  {
    id: "east",
    region: "ภาคตะวันออก",
    columns: 2,
    branches: [
      { slug: "central-chonburi", name: "Central Chonburi", detail: "ชั้น 3" },
      { slug: "central-si-racha", name: "Central Si Racha", detail: "ชั้น 3" },
    ],
  },
] satisfies BranchGroup[];

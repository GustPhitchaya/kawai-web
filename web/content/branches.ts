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
        mapUrl: "https://maps.app.goo.gl/BRKE1uLkVkSAxgic6",
      },
      {
        slug: "central-chaengwattana",
        name: "Central Chaengwattana",
        floor: "ชั้น 8",
        area: "ปากเกร็ด นนทบุรี",
        mapUrl: "https://maps.app.goo.gl/7aWTTLnZgbz15U8y6",
      },
      {
        slug: "central-bangna",
        name: "Central Bangna",
        floor: "ชั้น 5A",
        area: "บางนา กรุงเทพฯ",
        mapUrl: "https://maps.app.goo.gl/hd33BP4jAahCkD33A",
      },
      {
        slug: "central-rama-3",
        name: "Central Rama 3",
        floor: "ชั้น 7",
        area: "ยานนาวา กรุงเทพฯ",
        mapUrl: "https://maps.app.goo.gl/j9dPrvZoxHr9fVaF9",
      },
      {
        slug: "central-eastville",
        name: "Central EastVille",
        floor: "ชั้น 2",
        area: "ลาดพร้าว กรุงเทพฯ",
        mapUrl: "https://maps.app.goo.gl/KQ4HnhPopA1MPYN99",
      },
      {
        slug: "central-westgate",
        name: "Central Westgate",
        floor: "ชั้น G",
        area: "บางใหญ่ นนทบุรี",
        mapUrl: "https://maps.app.goo.gl/ze5HJcQHtfnre44W9",
      },
      {
        slug: "central-rama-2",
        name: "Central Rama 2",
        floor: "ชั้น 3",
        area: "บางขุนเทียน กรุงเทพฯ",
        mapUrl: "https://maps.app.goo.gl/smiorQ3wcagYMU4H7",
      },
      {
        slug: "central-plaza-mahachai",
        name: "Central Plaza Mahachai",
        floor: "ชั้น 2",
        area: "สมุทรสาคร",
        mapUrl: "https://maps.app.goo.gl/UdXGUQbqSK1d3rFV6",
      },
      {
        slug: "future-park-rangsit",
        name: "Future Park Rangsit",
        floor: "ชั้น 3",
        area: "ธัญบุรี ปทุมธานี",
        mapUrl: "https://maps.app.goo.gl/gLievDBXYYrcrCpK8",
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
        mapUrl: "https://maps.app.goo.gl/BBBmz4eBzZdRVvkq6",
      },
    ],
  },
  {
    id: "east",
    region: "ภาคตะวันออก",
    branches: [
      {
        slug: "central-chonburi",
        name: "Central Chonburi",
        floor: "ชั้น 3",
        area: "ชลบุรี",
        mapUrl: "https://maps.app.goo.gl/Qt2gCQjDfHbwkVhQA",
      },
      {
        slug: "central-si-racha",
        name: "Central Si Racha",
        floor: "ชั้น 3",
        area: "ศรีราชา ชลบุรี",
        mapUrl: "https://maps.app.goo.gl/1W9W6Lzmn3CoB4Mg7",
      },
    ],
  },
] satisfies BranchGroup[];

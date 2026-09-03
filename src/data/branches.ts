/** สาขาในประเทศไทย 12 สาขา — ข้อมูลจริง แบ่งเป็น 3 ภูมิภาค */
export type RegionKey = "bkk" | "north" | "east";

export type Branch = { name: string; detail: string };

export type Region = { key: RegionKey; label: string; branches: Branch[] };

export const REGIONS: Region[] = [
  {
    key: "bkk",
    label: "กรุงเทพฯ และปริมณฑล",
    branches: [
      {
        name: "CentralwOrld",
        detail: "ชั้น 6 โซน Genius Planet, ถ.ราชดำริ, ปทุมวัน กรุงเทพฯ",
      },
      { name: "Central Chaengwattana", detail: "ชั้น 8" },
      { name: "Central Bangna", detail: "ชั้น 5" },
      { name: "Central Rama 3", detail: "ชั้น 7" },
      { name: "Central EastVille", detail: "ชั้น 2" },
      { name: "Central Westgate", detail: "ชั้น G, บางใหญ่ นนทบุรี" },
      { name: "Central Rama 2", detail: "บางขุนเทียน กรุงเทพฯ" },
      { name: "Central Plaza Mahachai", detail: "สมุทรสาคร" },
      { name: "Future Park Rangsit", detail: "ปทุมธานี" },
    ],
  },
  {
    key: "north",
    label: "ภาคเหนือ",
    branches: [{ name: "Central Chiang Mai", detail: "ชั้น 3" }],
  },
  {
    key: "east",
    label: "ภาคตะวันออก",
    branches: [
      { name: "Central Chonburi", detail: "ชั้น 3" },
      { name: "Central Si Racha", detail: "ชั้น 3" },
    ],
  },
];

export const TOTAL_BRANCHES = REGIONS.reduce(
  (n, r) => n + r.branches.length,
  0,
);

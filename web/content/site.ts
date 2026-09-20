import type { ContactWay, NavLink, SiteConfig, SocialLink } from "./types";

const LINE_URL = "https://page.line.me/kawaiofficial";

export const siteConfig = {
  name: "KAWAI Music School Thailand",
  nameTh: "โรงเรียนสอนดนตรีคาไว",
  title: "KAWAI Music School Thailand | โรงเรียนสอนดนตรีคาไว",
  description:
    "โรงเรียนสอนดนตรีคาไว Personality & Harmony ก่อตั้งที่ญี่ปุ่นปี 1956 คอร์สสำหรับเด็ก 1 ขวบถึงผู้ใหญ่ ครูบรรเลงเปียโนสดทุกคาบ 12 สาขาทั่วไทย จองคลาสเรียนทดลองได้ทางไลน์",
  ogDescription: "ไม่ใช่แค่การเรียนดนตรี แต่เป็นการเรียนรู้ผ่านเสียงดนตรี",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  foundedYear: 1956,
  branchCount: 12,
  themeColor: "#DB2A1B",
  line: { url: LINE_URL, handle: "@kawaiofficial" },
  phone: { raw: "0642265945", display: "064 226 5945" },
  email: "Kawaithailand@gmail.com",
  facebook: {
    url: "https://facebook.com/kawaimusicschoolTH",
    handle: "kawaimusicschoolTH",
  },
  instagram: {
    url: "https://instagram.com/kawaimusicschool_th",
    handle: "kawaimusicschool_th",
  },
  logo: {
    src: "/images/logo.svg",
    alt: "KAWAI Music School",
    width: 500,
    height: 45,
  },
  footerBlurb:
    "โรงเรียนสอนดนตรีคาไว ก่อตั้งที่ประเทศญี่ปุ่นปี 1956 ปัจจุบันมี 12 สาขาในประเทศไทย",
  copyright: "© 2026 KAWAI Music School Thailand",
  skipLabel: "ข้ามไปยังเนื้อหาหลัก",
} satisfies SiteConfig;

export const lineCta = {
  header: "จองเรียนทดลอง",
  hero: "จองคลาสเรียนทดลองผ่าน LINE",
  courses: "ถามเรื่องคอร์สทางไลน์",
  contact: "แอดไลน์",
} as const;

/** Chrome and control labels that aren't part of any section's copy. */
export const ui = {
  homeAriaLabel: `${siteConfig.name} หน้าแรก`,
  navAriaLabel: "เมนูหลัก",
  menuOpenAriaLabel: "เปิดเมนู",
  menuLabel: "เมนู",
} as const;

export const navLinks = [
  { href: "#home", label: "หน้าแรก" },
  { href: "#about", label: "เกี่ยวกับเรา" },
  { href: "#courses", label: "คอร์สเรียน" },
  { href: "#exam", label: "การสอบ" },
  { href: "#events", label: "อีเวนท์" },
  { href: "#reviews", label: "รีวิว" },
  { href: "#branches", label: "สาขา" },
  { href: "#contact", label: "ติดต่อเรา" },
] satisfies NavLink[];

export const contactWays = [
  {
    icon: "phone",
    label: "โทร",
    value: siteConfig.phone.display,
    href: `tel:${siteConfig.phone.raw}`,
  },
  {
    icon: "mail",
    label: "อีเมล",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: "fb",
    label: "Facebook",
    value: siteConfig.facebook.handle,
    href: siteConfig.facebook.url,
    external: true,
  },
  {
    icon: "ig",
    label: "Instagram",
    value: siteConfig.instagram.handle,
    href: siteConfig.instagram.url,
    external: true,
  },
] satisfies ContactWay[];

export const socialLinks = [
  { icon: "line", href: siteConfig.line.url, label: "LINE" },
  { icon: "fb", href: siteConfig.facebook.url, label: "Facebook" },
  { icon: "ig", href: siteConfig.instagram.url, label: "Instagram" },
] satisfies SocialLink[];

export const footerColumns = [
  {
    heading: "เมนู",
    links: [
      { label: "เกี่ยวกับเรา", href: "#about" },
      { label: "คอร์สเรียน", href: "#courses" },
      { label: "การสอบ", href: "#exam" },
      { label: "อีเวนท์", href: "#events" },
      { label: "รีวิว", href: "#reviews" },
      { label: "สาขา", href: "#branches" },
      { label: "ติดต่อ", href: "#contact" },
    ],
  },
  {
    heading: "ติดต่อ",
    links: [
      {
        label: `LINE: ${siteConfig.line.handle}`,
        href: siteConfig.line.url,
        external: true,
      },
      { label: siteConfig.phone.display, href: `tel:${siteConfig.phone.raw}` },
      { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
    ],
  },
] as const;

import { lineCta, siteConfig } from "./site";
import type { HeroContent } from "./types";

const HERO_ALT = "เด็กหญิงกำลังเล่นเปียโนในห้องเรียนคาไว";

/**
 * Band `range` values and the band-0 `ramp` come straight from the
 * draft's data-band / data-ramp attributes. Split-text seeds 7 and 8
 * match the order the draft's splitWords() walked the DOM, so the word
 * thresholds are byte-identical.
 */
export const hero = {
  label: "แนะนำโรงเรียน",
  image: { src: "/images/hero.jpg", alt: HERO_ALT, width: 1080, height: 700 },
  imageMobile: {
    src: "/images/hero-mobile.jpg",
    alt: HERO_ALT,
    width: 650,
    height: 870,
  },
  scrollCue: "เลื่อนลง",
  bands: [
    {
      id: "intro",
      range: [0, 0.26],
      ramp: 0.032,
      effect: "rise",
      kicker: "Kawai Music School",
      heading: {
        text: "ไม่ใช่แค่การเรียนดนตรี แต่เป็นการเรียนรู้ ผ่าน เสียงดนตรี",
        as: "h1",
        seed: 7,
      },
      sub: "Personality & Harmony",
      badge: { highlight: "1956", text: "ก่อตั้งที่ประเทศญี่ปุ่น" },
    },
    {
      id: "individuality",
      range: [0.24, 0.54],
      effect: "approach",
      heading: { text: "เด็กทุกคนมีเอกลักษณ์เฉพาะตัว", as: "p" },
      sub: "และทุกคนสร้างเสียงที่งดงามร่วมกันได้",
    },
    {
      id: "live-piano",
      range: [0.52, 0.8],
      effect: "blur-to-sharp",
      heading: { text: "ทุกคาบ ครูบรรเลงเปียโนสดให้เด็กฟัง", as: "p" },
      sub: "ไม่มีซีดี ไม่มีเสียงจากลำโพง",
    },
    {
      id: "trial",
      range: [0.78, 1],
      effect: "rise-staged",
      interactive: true,
      heading: {
        text: "มาลองเรียนหนึ่งคาบ ก่อนตัดสินใจ",
        as: "p",
        seed: 8,
      },
      sub: "คลาสเรียนทดลองมีทุกสาขา ทักมาทางไลน์แล้วเลือกวันที่สะดวกได้เลย",
      ctas: [
        {
          label: lineCta.hero,
          href: siteConfig.line.url,
          variant: "brand",
          external: true,
        },
        {
          label: "ดูคอร์สเรียนทั้งหมด",
          href: "#courses",
          variant: "ghostOutline",
        },
      ],
    },
  ],
  static: {
    kicker: "Kawai Music School",
    heading: "ไม่ใช่แค่การเรียนดนตรี แต่เป็นการเรียนรู้ ผ่าน เสียงดนตรี",
    sub: "Personality & Harmony ตั้งแต่ปี 1956",
    badge: { highlight: "1956", text: "ก่อตั้งที่ประเทศญี่ปุ่น" },
    ctas: [
      {
        label: lineCta.hero,
        href: siteConfig.line.url,
        variant: "brand",
        external: true,
      },
      { label: "ดูคอร์สเรียน", href: "#courses", variant: "ghostOutline" },
    ],
  },
} satisfies HeroContent;

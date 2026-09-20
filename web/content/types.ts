/**
 * Every content shape for the site lives here. Data files use
 * `satisfies` against these types so the shape is checked while the
 * literals stay narrow.
 *
 * Image `src` values are plain strings pointing into /public/images so
 * the content layer stays pure data and can move to a CMS later.
 */

export type IconName = "line" | "fb" | "ig" | "phone" | "mail" | "pin";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface Cta {
  label: string;
  href: string;
  variant: "brand" | "ghostOutline" | "onDeep";
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  nameTh: string;
  title: string;
  description: string;
  ogDescription: string;
  url: string;
  foundedYear: number;
  branchCount: number;
  themeColor: string;
  line: { url: string; handle: string };
  phone: { raw: string; display: string };
  email: string;
  facebook: { url: string; handle: string };
  instagram: { url: string; handle: string };
  logo: ImageAsset;
  footerBlurb: string;
  copyright: string;
  skipLabel: string;
}

export interface ContactWay {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  icon: IconName;
  href: string;
  label: string;
}

/* ------------------------------ hero ------------------------------ */

/**
 * `range` is the scroll-progress window the band occupies (data-band in
 * the draft). `ramp` overrides the derived `--k` ramp (data-ramp).
 * `effect` selects which reveal treatment the band body uses.
 */
export type BandEffect = "rise" | "approach" | "blur-to-sharp" | "rise-staged";

export interface HeroBand {
  id: string;
  range: [start: number, end: number];
  ramp?: number;
  effect: BandEffect;
  kicker?: string;
  /** Word-split headline. `seed` feeds the deterministic LCG. */
  heading?: { text: string; as: "h1" | "p"; seed?: number };
  sub?: string;
  badge?: { highlight: string; text: string };
  ctas?: Cta[];
  /** `.band.live` — the band that accepts pointer events. */
  interactive?: boolean;
}

export interface HeroContent {
  label: string;
  image: ImageAsset;
  imageMobile: ImageAsset;
  scrollCue: string;
  bands: HeroBand[];
  static: {
    kicker: string;
    heading: string;
    sub: string;
    badge: { highlight: string; text: string };
    ctas: Cta[];
  };
}

/* --------------------------- sections ----------------------------- */

export interface SectionHeadContent {
  kicker: string;
  heading: string;
  lead?: string;
}

export interface PhilosophyContent {
  id: string;
  head: SectionHeadContent;
  paragraphs: string[];
  /** The two emphasised terms render in the brand colour. */
  pillword: { terms: [string, string]; joiner: string; suffix: string };
  image: ImageAsset;
  highlight: { tag: string; heading: string };
}

export interface Strength {
  num: "01" | "02" | "03";
  title: string;
  body: string;
  image: ImageAsset;
  /** Puts the photo second on wide screens (.srow.flip). */
  flip: boolean;
}

export interface Course {
  slug: string;
  ageLabel: string;
  title: string;
  titleTh: string;
  description: string;
  facts: string[];
  image: ImageAsset;
  ctaHref: string;
  ctaLabel: string;
}

export interface InstrumentBlock {
  title: string;
  body: string;
  chips: string[];
  cta: Cta;
}

export interface HarmonyKey {
  caption: string;
  /** Height as a percentage of the key rail (56/70/100/78/62). */
  heightPct: number;
  /** Frequency in Hz — together the five keys spell a Cmaj9. */
  freq: number;
}

export interface HarmonyContent {
  id: string;
  head: SectionHeadContent;
  keys: HarmonyKey[];
  /** Hold progress at which each key lights and sounds. */
  thresholds: number[];
  holdMs: number;
  releaseMs: number;
  button: string;
  help: { idle: string; holding: string; done: string };
  idle: { title: string; body: string };
  payoff: { prefix: string; emphasis: string; body: string };
}

export interface ExamLevel {
  level: string;
  title: string;
  body: string;
}

export interface ExamContent {
  id: string;
  head: SectionHeadContent;
  levels: ExamLevel[];
  note: string;
}

export interface EventItem {
  slug: string;
  when: string;
  title: string;
  body: string;
  image: ImageAsset;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface Branch {
  slug: string;
  name: string;
  detail: string;
}

export interface BranchGroup {
  id: string;
  region: string;
  /** Column count on wide screens (.blist / .blist.two / .blist.one). */
  columns: 1 | 2 | 3;
  branches: Branch[];
}

export interface ContactContent {
  id: string;
  head: SectionHeadContent;
  lineBlock: { tag: string; heading: string; body: string; cta: Cta };
  waysTitle: string;
  ways: ContactWay[];
  waysNote: string;
}

/**
 * A full-width typographic break between sections. `seed` feeds the
 * deterministic word-split LCG and must not collide with the hero's
 * seeds (7 and 8) or the headline would hydrate with a mismatch.
 */
export interface Statement {
  id: string;
  text: string;
  /** Whole space-separated words to render in the brand colour. */
  emphasis: string[];
  tone: "canvas" | "deep";
  seed: number;
}

export interface FooterColumn {
  heading: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}

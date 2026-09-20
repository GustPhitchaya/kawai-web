import type { Statement } from "./types";

/**
 * Full-width typographic breaks that interrupt the run of card
 * sections. The copy is lifted from lines the site already says — these
 * give the page's two strongest claims room to land rather than adding
 * new marketing.
 *
 * `emphasis` lists whole space-separated words that render in the brand
 * colour. A word that doesn't match simply isn't highlighted.
 */
export const statements = {
  learning: {
    id: "learning",
    text: "ไม่ใช่แค่การเรียนดนตรี แต่เป็นการเรียนรู้ ผ่าน เสียงดนตรี",
    emphasis: ["เสียงดนตรี"],
    tone: "canvas",
    seed: 11,
  },
  livePiano: {
    id: "live-piano",
    text: "ทุกคาบ ครูบรรเลงเปียโนสดให้เด็กฟัง ไม่มีซีดี ไม่มีเสียงจากลำโพง",
    emphasis: ["ครูบรรเลงเปียโนสดให้เด็กฟัง"],
    tone: "deep",
    seed: 12,
  },
} satisfies Record<string, Statement>;

"use client";

import { CONTACT, NAV_ITEMS } from "@/data/nav";
import { CtaButton } from "@/components/ui/CtaButton";

type Props = {
  open: boolean;
  onClose: () => void;
  id: string;
};

/** เมนูมือถือ — slide in จากขวา พร้อม stagger รายการละ 40ms */
export function MobileMenu({ open, onClose, id }: Props) {
  return (
    <div
      id={id}
      // ยังอยู่ใน DOM เสมอเพื่อให้ transform เลื่อนได้ แต่ซ่อนจาก a11y tree ตอนปิด
      inert={!open}
      style={{
        transform: open ? "translateX(0)" : "translateX(100%)",
        transitionDuration: "var(--dur-base)",
        transitionTimingFunction: "var(--ease-out)",
      }}
      className="fixed inset-y-0 right-0 z-70 flex w-[min(80vw,320px)] flex-col gap-1 bg-white px-7 pt-22 pb-7 shadow-[-20px_0_60px_rgba(15,16,21,.14)] transition-transform lg:hidden"
    >
      {NAV_ITEMS.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={onClose}
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateX(16px)",
            transitionProperty: "opacity, transform",
            transitionDuration: "var(--dur-base)",
            transitionTimingFunction: "var(--ease-out)",
            transitionDelay: open ? `${60 + i * 40}ms` : "0ms",
          }}
          className="border-b border-ink/5 py-3 text-base text-ink"
        >
          {item.label}
        </a>
      ))}

      <div
        style={{
          opacity: open ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "var(--dur-base)",
          transitionTimingFunction: "var(--ease-out)",
          transitionDelay: open ? `${60 + NAV_ITEMS.length * 40}ms` : "0ms",
        }}
        className="mt-6"
      >
        <CtaButton href={CONTACT.lineUrl} size="sm">
          จองเรียนทดลอง
        </CtaButton>
      </div>
    </div>
  );
}

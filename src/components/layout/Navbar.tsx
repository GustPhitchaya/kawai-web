"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS, CONTACT } from "@/data/nav";
import { useSound } from "@/lib/sound/SoundContext";
import { useRafScroll } from "@/lib/hooks/useRafScroll";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { CtaButton } from "@/components/ui/CtaButton";
import { MobileMenu } from "./MobileMenu";
import { ScrollProgressWave } from "./ScrollProgressWave";

/** โน้ต pentatonic ไล่ขึ้นตามลำดับเมนู — เมนูซ้ายสุดต่ำสุด */
const NAV_NOTES = [60, 62, 64, 67, 69, 72, 74, 76];
const MENU_ID = "kawai-mobile-menu";

export function Navbar() {
  const { engine } = useSound();
  const [solid, setSolid] = useState(false);
  const [activeId, setActiveId] = useState(NAV_ITEMS[0].id);
  const [menuOpen, setMenuOpen] = useState(false);

  const linksRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  // navbar เปลี่ยนเป็นพื้นขาว blur เมื่อ scroll เกิน 80px + scroll spy
  useRafScroll(
    useCallback(() => {
      setSolid(window.scrollY > 80);

      let current = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 140) current = item.id;
      }
      setActiveId(current);
    }, []),
  );

  // ขีดใต้เลื่อนตามเมนูที่ active แบบ smooth (ต้องวัดตำแหน่งจริงหลัง layout)
  useEffect(() => {
    const sync = () => {
      const wrap = linksRef.current;
      const underline = underlineRef.current;
      if (!wrap || !underline) return;
      const link = wrap.querySelector<HTMLAnchorElement>(
        `[data-nav="${activeId}"]`,
      );
      if (!link || !link.offsetParent) return;
      underline.style.width = `${link.offsetWidth}px`;
      underline.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [activeId]);

  // ปิดเมนูมือถือด้วย Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    engine.playNoise({ dur: 0.22, freq: 700, gain: 0.18 });
  };

  return (
    <>
      <header
        style={{
          backgroundColor: solid ? "rgba(255,255,255,.82)" : "rgba(249,249,251,0)",
          backdropFilter: solid ? "saturate(160%) blur(14px)" : "none",
          boxShadow: solid ? "0 2px 20px rgba(15,16,21,.07)" : "none",
          transitionProperty: "background-color, box-shadow",
          transitionDuration: "var(--dur-base)",
          transitionTimingFunction: "var(--ease-out)",
        }}
        // z สูงกว่าเมนูมือถือ เพื่อให้ปุ่มกากบาทยังกดปิดได้ตอนเมนูเปิด
        className="fixed inset-x-0 top-0 z-80"
      >
        <div className="mx-auto flex max-w-[1240px] items-center gap-5 px-6 py-3.5">
          <a href="#home" className="flex items-center text-ink">
            <Image
              src="/kawai-logo.svg"
              alt="KAWAI Music School"
              width={120}
              height={22}
              priority
              style={{ width: "auto", height: 22 }}
              className="block"
            />
          </a>

          <nav
            ref={linksRef}
            aria-label="เมนูหลัก"
            className="relative ml-auto hidden items-center gap-[22px] lg:flex"
          >
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-nav={item.id}
                aria-current={activeId === item.id ? "true" : undefined}
                onMouseEnter={() => engine.ui(NAV_NOTES[i] ?? 60)}
                style={{
                  color: activeId === item.id ? "#DB2A1B" : "rgb(15,16,21)",
                  transitionDuration: "var(--dur-base)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                className="py-1.5 text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
            <span
              ref={underlineRef}
              aria-hidden="true"
              style={{
                transitionProperty: "transform, width",
                transitionDuration: "var(--dur-base)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              className="pointer-events-none absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-sm bg-kawai-red"
            />
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <SoundToggle />
            {/* บนมือถือซ่อนไว้ — CTA เดียวกันอยู่ใน hero และเมนูอยู่แล้ว */}
            <div className="hidden sm:block">
              <CtaButton href={CONTACT.lineUrl} size="sm">
                จองเรียนทดลอง
              </CtaButton>
            </div>
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border border-ink/15 bg-white lg:hidden"
            >
              {/* 3 ขีด morph เป็นกากบาทด้วย transform */}
              <span
                aria-hidden="true"
                style={{
                  transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                  transitionDuration: "var(--dur-base)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                className="block h-0.5 w-[18px] bg-ink transition-transform"
              />
              <span
                aria-hidden="true"
                style={{
                  opacity: menuOpen ? 0 : 1,
                  transitionDuration: "var(--dur-fast)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                className="block h-0.5 w-[18px] bg-ink transition-opacity"
              />
              <span
                aria-hidden="true"
                style={{
                  transform: menuOpen
                    ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                  transitionDuration: "var(--dur-base)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                className="block h-0.5 w-[18px] bg-ink transition-transform"
              />
            </button>
          </div>
        </div>

        <ScrollProgressWave />
      </header>

      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

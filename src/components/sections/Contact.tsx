"use client";

import { useCallback, useRef } from "react";
import { CONTACT } from "@/data/nav";
import { useSound } from "@/lib/sound/SoundContext";

const CHANNELS = [
  {
    label: "LINE",
    href: CONTACT.lineUrl,
    title: "Official Account",
    sub: CONTACT.lineId,
  },
  {
    label: "โทร",
    href: CONTACT.telHref,
    title: CONTACT.tel,
    sub: CONTACT.email,
  },
  {
    label: "Facebook",
    href: CONTACT.facebook,
    title: CONTACT.facebookHandle,
  },
  {
    label: "Instagram",
    href: CONTACT.instagram,
    title: CONTACT.instagramHandle,
  },
];

export function Contact() {
  const { engine, reduced } = useSound();
  const hostRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  /** วงคลื่นเสียงกระเพื่อมออกจากปุ่ม LINE ตอน hover */
  const ripple = useCallback((rings: number) => {
    const host = hostRef.current;
    const btn = btnRef.current;
    if (!host || !btn) return;
    const rect = btn.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const x = rect.left - hr.left + rect.width / 2;
    const y = rect.top - hr.top + rect.height / 2;
    for (let i = 0; i < rings; i++) {
      const r = document.createElement("span");
      r.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:60px;height:60px;border-radius:999px;border:2px solid #DB2A1B;pointer-events:none;animation:kwRipple 900ms var(--ease-out) forwards;animation-delay:${i * 140}ms`;
      host.appendChild(r);
      window.setTimeout(() => r.remove(), 1200 + i * 140);
    }
  }, []);

  /** โน้ตดนตรีพุ่งกระจายขึ้นจากปุ่ม — transform ล้วน ผ่าน requestAnimationFrame */
  const noteConfetti = useCallback(() => {
    const host = hostRef.current;
    const btn = btnRef.current;
    if (!host || !btn) return;
    const rect = btn.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const cx = rect.left - hr.left + rect.width / 2;
    const cy = rect.top - hr.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.textContent = i % 2 ? "♪" : "♫";
      s.setAttribute("aria-hidden", "true");
      s.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${16 + Math.random() * 14}px;color:#DB2A1B;pointer-events:none;will-change:transform`;
      host.appendChild(s);

      const vx = (Math.random() - 0.5) * 320;
      const vy = -(180 + Math.random() * 220);
      const rot = (Math.random() - 0.5) * 300;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = (t - t0) / 1100;
        if (p >= 1) {
          s.remove();
          return;
        }
        s.style.transform = `translate(${vx * p}px,${vy * p + 420 * p * p}px) rotate(${rot * p}deg)`;
        s.style.opacity = String(1 - p);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, []);

  const onLineHover = () => {
    if (reduced) return;
    engine.chord([60, 64, 67, 72], {
      gain: 0.16,
      dur: 0.6,
      stagger: 0.06,
      harmonic: false,
    });
    ripple(2);
  };

  const onLineClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    engine.chord([60, 64, 67], { gain: 0.5, dur: 1.6 });
    // ปิด motion อยู่ → เปิดลิงก์ทันที ไม่หน่วง
    if (reduced) return;
    e.preventDefault();
    noteConfetti();
    const href = e.currentTarget.href;
    window.setTimeout(() => window.open(href, "_blank", "noopener"), 250);
  };

  return (
    <section id="contact" className="mx-auto max-w-[1240px] px-6 pt-5 pb-25">
      <div className="rounded-[28px] bg-white p-[clamp(32px,5vw,64px)] text-center shadow-[0_20px_60px_rgba(15,16,21,.07)]">
        <h2 className="mx-auto mb-9 max-w-[24ch] font-display text-[clamp(26px,3.4vw,44px)] leading-[1.3] font-semibold">
          พร้อมเริ่มต้นเส้นทางดนตรีไปกับ KAWAI แล้วหรือยัง?
        </h2>

        <div ref={hostRef} className="relative mb-8 flex justify-center">
          <a
            ref={btnRef}
            href={CONTACT.lineUrl}
            target="_blank"
            rel="noopener"
            onMouseEnter={onLineHover}
            onClick={onLineClick}
            style={{
              transitionProperty: "transform, box-shadow",
              transitionDuration: "var(--dur-fast)",
              transitionTimingFunction: "var(--ease-out)",
            }}
            className="relative rounded-full bg-kawai-red px-10 py-5 text-lg font-medium text-white hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(219,42,27,.34)]"
          >
            แอดไลน์ — จองคลาสเรียนทดลอง
          </a>
        </div>

        <div className="grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.href.startsWith("http")
                ? { target: "_blank", rel: "noopener" }
                : {})}
              style={{
                transitionProperty: "border-color, transform",
                transitionDuration: "var(--dur-fast)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              className="rounded-2xl border border-ink/10 p-5 text-ink hover:-translate-y-0.5 hover:border-kawai-red"
            >
              <div className="mb-2 text-xs tracking-[.14em] text-ink/45 uppercase">
                {c.label}
              </div>
              <div className="font-medium">{c.title}</div>
              {c.sub && (
                <div className="text-[13px] text-ink/55">{c.sub}</div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

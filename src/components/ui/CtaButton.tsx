"use client";

import { useSound } from "@/lib/sound/SoundContext";

type Props = {
  href: string;
  children: React.ReactNode;
  /** primary = พื้นแดง, secondary = พื้นขาวมีเส้นขอบ */
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
};

/**
 * ปุ่ม CTA หลัก — hover เล่นคอร์ด C major arpeggio ไล่ขึ้น, click เล่นคอร์ดเต็ม + sparkle
 */
export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: Props) {
  const { engine, reduced } = useSound();
  const external = href.startsWith("http");

  const onEnter = () => {
    if (reduced) return;
    engine.chord([60, 64, 67], {
      gain: 0.16,
      dur: 0.5,
      stagger: 0.06,
      harmonic: false,
    });
  };

  const onClick = () => {
    engine.chord([60, 64, 67], { gain: 0.4, dur: 1.2 });
    engine.playNote(96, {
      type: "sine",
      gain: 0.07,
      dur: 0.25,
      harmonic: false,
      delay: 0.02,
    });
  };

  const base =
    "inline-block rounded-full font-medium transition-[transform,box-shadow,border-color] hover:-translate-y-0.5";
  const sizing = size === "sm" ? "px-5 py-[11px] text-sm" : "px-7 py-4 text-base";
  const look =
    variant === "primary"
      ? "bg-kawai-red text-white hover:shadow-[0_12px_28px_rgba(219,42,27,.32)]"
      : "border border-ink/15 bg-white text-ink hover:border-kawai-red";

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      onMouseEnter={onEnter}
      onClick={onClick}
      style={{
        transitionDuration: "var(--dur-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
      className={`${base} ${sizing} ${look} ${className}`}
    >
      {children}
    </a>
  );
}

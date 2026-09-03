"use client";

import { useReveal } from "@/lib/hooks/useReveal";

/**
 * ไอคอน line-art ที่วาดตัวเองขึ้นมา — ใช้ pathLength="1" เพื่อให้ dasharray เท่ากันทุกทรง
 * hover ของแต่ละการ์ดใช้ท่าต่างกัน (หมุน / ขยาย / เด้ง) ตาม spec
 */
const FEATURES = [
  {
    title: "เอกลักษณ์เฉพาะตัว",
    description:
      "เราบ่มเพาะบุคลิกภาพที่เป็นเอกลักษณ์เฉพาะตัวของนักเรียนแต่ละคน และส่งเสริมการแสดงออกถึงตัวตนอย่างมีความสุข ก้าวข้ามมาตรฐานแบบดั้งเดิม",
    hover: "group-hover:rotate-[16deg]",
    icon: (
      <>
        <circle
          pathLength="1"
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke="#DB2A1B"
          strokeWidth="2.5"
        />
        <circle
          pathLength="1"
          cx="32"
          cy="32"
          r="7"
          fill="none"
          stroke="rgb(15,16,21)"
          strokeWidth="2.5"
        />
      </>
    ),
  },
  {
    title: "สภาพแวดล้อมที่ส่งเสริมการเรียนรู้",
    description:
      "เราจัดเตรียมพื้นที่ที่เอื้อต่อการบ่มเพาะ ให้นักเรียนได้แสดงออกถึงตัวตนได้อย่างอิสระ และยอมรับชื่นชมในความเป็นเอกลักษณ์ของตนเอง",
    hover: "group-hover:scale-[1.18]",
    icon: (
      <>
        <rect
          pathLength="1"
          x="10"
          y="14"
          width="44"
          height="36"
          rx="8"
          fill="none"
          stroke="#DB2A1B"
          strokeWidth="2.5"
        />
        <line
          pathLength="1"
          x1="10"
          y1="38"
          x2="54"
          y2="38"
          stroke="rgb(15,16,21)"
          strokeWidth="2.5"
        />
      </>
    ),
  },
  {
    title: "ผู้สอนผู้เชี่ยวชาญ",
    description:
      "ครูผู้สอนที่เชี่ยวชาญของเรามีชื่อเสียงด้านแนวทางการสอนที่เป็นนวัตกรรม",
    hover: "group-hover:-translate-y-1.5",
    icon: (
      <>
        <line
          pathLength="1"
          x1="20"
          y1="50"
          x2="20"
          y2="18"
          stroke="rgb(15,16,21)"
          strokeWidth="2.5"
        />
        <circle
          pathLength="1"
          cx="38"
          cy="44"
          r="10"
          fill="none"
          stroke="#DB2A1B"
          strokeWidth="2.5"
        />
        <line
          pathLength="1"
          x1="20"
          y1="18"
          x2="48"
          y2="24"
          stroke="#DB2A1B"
          strokeWidth="2.5"
        />
      </>
    ),
  },
];

export function Features() {
  const { ref, revealed, armed } = useReveal<HTMLDivElement>(0.15);
  const hidden = armed && !revealed;

  return (
    <section className="mx-auto max-w-[1240px] px-6 pt-5 pb-24">
      <h2 className="mb-10 max-w-[20ch] font-display text-[clamp(26px,3vw,40px)] font-semibold">
        3 จุดเด่นของระบบการศึกษาดนตรี KAWAI
      </h2>

      <div ref={ref} className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <article
            key={feature.title}
            style={{
              opacity: hidden ? 0 : 1,
              transform: hidden ? "translateX(-28px)" : "none",
              transitionProperty: "opacity, transform, box-shadow",
              transitionDuration: "600ms",
              transitionTimingFunction: "var(--ease-out)",
              transitionDelay: hidden ? "0ms" : `${i * 120}ms`,
            }}
            className="group rounded-[20px] bg-white p-8 shadow-[0_10px_30px_rgba(15,16,21,.05)] hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,16,21,.09)]"
          >
            <svg
              viewBox="0 0 64 64"
              aria-hidden="true"
              style={{
                transitionProperty: "transform",
                transitionDuration: "var(--dur-base)",
                transitionTimingFunction: "var(--ease-spring)",
              }}
              className={`mb-5.5 h-13 w-13 ${feature.hover}`}
            >
              <g
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: hidden ? 1 : 0,
                  transitionProperty: "stroke-dashoffset",
                  transitionDuration: "700ms",
                  transitionTimingFunction: "var(--ease-out)",
                  transitionDelay: hidden ? "0ms" : `${i * 120 + 200}ms`,
                }}
              >
                {feature.icon}
              </g>
            </svg>
            <h3 className="mb-3 font-display text-xl font-semibold">
              {feature.title}
            </h3>
            <p className="text-[15px] leading-[1.8] text-ink/65">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

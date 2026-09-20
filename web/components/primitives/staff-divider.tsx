"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

const LINE_Y = [1, 7, 13, 19, 25];
const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * The five-line musical staff that opens most sections. The lines draw
 * themselves in left to right, 70ms apart, and the note head slides in
 * once they are underway — the same choreography the draft did with
 * stroke-dashoffset transitions and nth-child delays.
 */
export function StaffDivider({
  tone = "paper",
  className,
}: {
  tone?: "paper" | "deep";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const stroke = tone === "deep" ? "rgb(255 255 255 / 0.16)" : "var(--color-line)";

  return (
    <motion.svg
      className={cn("mb-[26px] h-[26px] w-full overflow-visible", className)}
      viewBox="0 0 1200 26"
      aria-hidden="true"
      preserveAspectRatio="none"
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -12% 0px" }}
    >
      {LINE_Y.map((y, i) => (
        <motion.line
          key={y}
          x1="0"
          y1={y}
          x2="1200"
          y2={y}
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray="1400"
          variants={{
            hidden: { strokeDashoffset: 1400 },
            visible: {
              strokeDashoffset: 0,
              transition: { duration: 1.5, ease: EASE, delay: i * 0.07 },
            },
          }}
        />
      ))}
      <motion.ellipse
        cx="42"
        cy="13"
        rx="9"
        ry="6.4"
        fill="var(--color-brand)"
        variants={{
          hidden: { opacity: 0, x: -16 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.9, ease: EASE, delay: 0.55 },
          },
        }}
      />
    </motion.svg>
  );
}

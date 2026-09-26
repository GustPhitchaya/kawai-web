"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "cn";

/**
 * Replaces the draft's `[data-reveal]` IntersectionObserver plus its
 * `.part:nth-child()` transition-delay ladder.
 *
 * Framer's stagger is orchestration rather than CSS delay, so the
 * draft's `.done` class — which existed only to zero those delays back
 * out so hover transitions weren't held up — is no longer needed.
 *
 * `children` is passed straight through, so everything inside stays a
 * server component; only this wrapper ships to the client.
 */

const KAWAI_EASE = [0.22, 0.61, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const part: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: KAWAI_EASE },
  },
};

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A direct child of a `<Reveal>` that staggers its own children in
 * turn — for the places where the draft nested `.part` elements inside
 * a grid (`.philo`, `.hbox`, `.cgrid`, `.blist`).
 */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={container} className={className}>
      {children}
    </motion.div>
  );
}

/** One staggered child of a `<Reveal>`. Must be a direct child. */
export function RevealPart({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "figure" | "section" | "li";
}) {
  const Tag = motion[as];
  return (
    <Tag variants={part} className={cn(className)}>
      {children}
    </Tag>
  );
}

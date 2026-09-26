import { Award, CalendarDays } from "lucide-react";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { exam } from "@/content";
import type { ExamFact, ExamLevel } from "@/content/types";

/**
 * The levels are measured the way music already measures height: as
 * pitch on a five-line staff. Level 01 sits on the bottom line and each
 * level after it climbs, so the order reads before a word of the cards
 * does.
 *
 * This replaces a stagger that pushed each card down by a fixed offset.
 * With nothing on screen to say what the height meant, it read as three
 * cards floating at random.
 */

/** Staff line y-positions in the wide band's 130px-tall viewBox. */
const BAND_LINES = [30, 47, 64, 81, 98];
/** Staff line y-positions in the per-card mini staff (58px tall). */
const MINI_LINES = [6, 17, 28, 39, 50];

/**
 * Where level `i` of `n` sits on a staff: the bottom line for the
 * first, the top line for the last, evenly between.
 */
function pitch(lines: number[], i: number, n: number) {
  const bottom = lines[lines.length - 1];
  const top = lines[0];
  return n === 1 ? bottom : bottom - ((bottom - top) * i) / (n - 1);
}

export default function ExamSection() {
  const n = exam.levels.length;

  return (
    <Section id={exam.id}>
      <Reveal>
        <RevealPart>
          <SectionHead content={exam.head} className="mb-0" />
        </RevealPart>

        <RevealPart className="mt-head max-dt:hidden">
          <StaffBand n={n} />
        </RevealPart>

        <ol className="grid grid-cols-3 gap-gap-sm max-dt:mt-head max-dt:grid-cols-1">
          {exam.levels.map((level, i) => (
            <LevelCard key={level.level} level={level} index={i} n={n} />
          ))}
        </ol>

        <RevealPart className="bg-warm rounded-card mt-note flex items-stretch gap-gap-sm px-7 py-5.5 max-tb:flex-col max-tb:gap-4 max-tb:px-5.5 max-tb:py-5">
          {exam.facts.map((fact, i) => (
            <Fact key={fact.title} fact={fact} divided={i > 0} />
          ))}
        </RevealPart>
      </Reveal>
    </Section>
  );
}

/**
 * The shared staff above the three columns. x positions are percentages
 * of the column centres, so the band stretches with the grid instead of
 * being drawn at one width; y stays in px so the notes stay round.
 *
 * Percentages ignore the grid gap, which puts the outer notes a few px
 * off their card's true centre — invisible at this scale, and it keeps
 * the band free of layout measurement.
 */
function StaffBand({ n }: { n: number }) {
  const notes = Array.from({ length: n }, (_, i) => ({
    x: `${((i + 0.5) / n) * 100}%`,
    y: pitch(BAND_LINES, i, n),
  }));

  return (
    <svg className="block h-32.5 w-full overflow-visible" aria-hidden="true">
      <g className="stroke-line-strong/60" strokeWidth={1}>
        {BAND_LINES.map((y) => (
          <line key={y} x1="0" x2="100%" y1={y} y2={y} />
        ))}
      </g>
      {/* The contour, one segment per step up. */}
      <g className="stroke-brand/50" strokeWidth={2} strokeLinecap="round">
        {notes.slice(1).map((note, i) => (
          <line
            key={note.x}
            x1={notes[i].x}
            y1={notes[i].y}
            x2={note.x}
            y2={note.y}
          />
        ))}
      </g>
      {/* Drops from each note to its card: longer the higher it sits. */}
      <g
        className="stroke-brand/40"
        strokeWidth={1.5}
        strokeDasharray="3 5"
        strokeLinecap="round"
      >
        {notes.map((note) => (
          <line key={note.x} x1={note.x} y1={note.y} x2={note.x} y2={130} />
        ))}
      </g>
      <g className="fill-brand">
        {notes.map((note) => (
          <circle key={note.x} cx={note.x} cy={note.y} r={10} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Below `dt` the cards stack and the shared band would have nothing to
 * line up with, so each card carries its own small staff instead: every
 * level's position as a ring, its own filled in.
 */
function MiniStaff({ index, n }: { index: number; n: number }) {
  const xs = Array.from({ length: n }, (_, i) => 22 + (66 * i) / (n - 1 || 1));
  const ys = xs.map((_, i) => pitch(MINI_LINES, i, n));

  return (
    <svg
      viewBox="0 0 110 58"
      className="h-14.5 w-27.5 shrink-0 overflow-visible dt:hidden"
      aria-hidden="true"
    >
      <g className="stroke-line-strong/60" strokeWidth={1}>
        {MINI_LINES.map((y) => (
          <line key={y} x1={0} x2={110} y1={y} y2={y} />
        ))}
      </g>
      <polyline
        points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")}
        className="stroke-brand/30"
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {xs.map((x, i) =>
        i === index ? (
          <circle key={x} cx={x} cy={ys[i]} r={7} className="fill-brand" />
        ) : (
          <circle
            key={x}
            cx={x}
            cy={ys[i]}
            r={4}
            fill="none"
            className="stroke-line-strong"
            strokeWidth={1.5}
          />
        ),
      )}
    </svg>
  );
}

function LevelCard({
  level,
  index,
  n,
}: {
  level: ExamLevel;
  index: number;
  n: number;
}) {
  // "Level 01" → "01"; the big numeral carries the order on its own.
  const numeral = level.level.replace(/\D+/g, "");

  return (
    <RevealPart
      as="li"
      className="bg-panel border-line rounded-tile duration-550 ease-kawai flex flex-col border px-7 pt-6.5 pb-6 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-panel max-tb:px-5.5 max-tb:pt-5 max-tb:pb-4.5"
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h3 className="flex items-baseline gap-3.5">
          <span
            aria-hidden="true"
            className="text-brand text-[2.9rem] leading-none font-bold tracking-[-0.02em] max-tb:text-[2.4rem]">
            {numeral}
          </span>
          <span className="text-[1.3rem] font-semibold max-tb:text-[1.12rem]">
            <span className="sr-only">{level.level} </span>
            {level.title}
          </span>
        </h3>
        <MiniStaff index={index} n={n} />
      </div>

      <p className="text-ink-soft text-[0.95rem]">{level.body}</p>

      <div className="bg-line mt-5 mb-4 h-px" />

      <div className="text-ink-soft mb-3 text-[0.7rem] font-medium tracking-[0.16em]">
        {exam.addsLabel}
      </div>
      <ul className="flex flex-wrap gap-2">
        {level.adds.map((skill) => (
          <li
            key={skill}
            className="bg-brand-ink rounded-pill px-3.25 py-1.25 text-[0.82rem] font-medium text-white"
          >
            {skill}
          </li>
        ))}
      </ul>

      <div className="text-ink-soft mt-auto pt-4.5 text-[0.82rem]">
        {level.buildsOn}
      </div>
    </RevealPart>
  );
}

const FACT_ICON = { calendar: CalendarDays, award: Award } as const;

function Fact({ fact, divided }: { fact: ExamFact; divided: boolean }) {
  const Icon = FACT_ICON[fact.icon];
  return (
    <>
      {divided ? (
        <div className="bg-line-strong/60 w-px shrink-0 max-tb:h-px max-tb:w-auto" />
      ) : null}
      <div className="flex flex-1 items-center gap-3.5">
        <Icon className="text-brand-ink size-6 shrink-0" strokeWidth={1.7} aria-hidden="true" />
        <div>
          <div className="text-[0.95rem] font-semibold">{fact.title}</div>
          <div className="text-ink-soft text-[0.85rem]">{fact.body}</div>
        </div>
      </div>
    </>
  );
}

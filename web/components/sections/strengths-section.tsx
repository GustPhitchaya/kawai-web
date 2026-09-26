import Image from "next/image";
import { cn } from "cn";
import { Kicker } from "@/components/primitives/kicker";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { strengths, strengthsHead } from "@/content";
import type { Strength } from "@/content/types";

/**
 * Three strengths as a mosaic: the first, KAWAI's "Personality" idea,
 * as one tall tile, and the two that make it possible stacked beside
 * it. It replaces three alternating photo/text rows (1,836px at
 * 1440) whose text column sat mostly empty, because each strength is
 * only a sentence or two.
 *
 * It is also the one layout on the page where the pieces are not all
 * the same size. Exam, branches and contact are all rows of equal
 * cards.
 *
 * The mosaic needs a fixed height to split into two rows, and the side
 * tiles only have room for their text from `nav` up. Below that
 * everything stacks: the lead tile full width, the other two with the
 * photo beside the text.
 */
export default function StrengthsSection() {
  const [lead, ...rest] = strengths;

  return (
    <Section className="border-line border-t">
      <Reveal>
        <RevealPart className="mb-10">
          <Kicker>{strengthsHead.kicker}</Kicker>
          <h2 className="text-h2">{strengthsHead.heading}</h2>
        </RevealPart>

        <ol className="grid grid-cols-1 gap-5 max-ph:gap-3.5 nav:h-[clamp(560px,45vw,640px)] nav:grid-cols-[1.2fr_1fr] nav:grid-rows-2">
          <LeadTile item={lead} />
          {rest.map((item) => (
            <SideTile key={item.num} item={item} />
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

const TILE =
  "bg-panel border-line rounded-card group overflow-hidden border";

function NumBadge({ num, small }: { num: string; small?: boolean }) {
  return (
    <span
      className={cn(
        "bg-panel text-brand-ink rounded-pill absolute z-10 grid place-items-center font-bold",
        small
          ? "top-4 left-4 h-9 min-w-9 px-3 text-[0.92rem] max-ph:top-2.5 max-ph:left-2.5 max-ph:h-7 max-ph:min-w-7 max-ph:px-2 max-ph:text-[0.78rem]"
          : "top-5.5 left-6 h-10 min-w-10 px-3.5 text-[1.05rem] max-ph:top-4 max-ph:left-4",
      )}
    >
      {num}
    </span>
  );
}

function Photo({ item, sizes }: { item: Strength; sizes: string }) {
  return (
    <Image
      src={item.image.src}
      alt={item.image.alt}
      fill
      sizes={sizes}
      loading="lazy"
      style={item.focus ? { objectPosition: item.focus } : undefined}
      className="duration-1300 ease-kawai object-cover transition-transform group-hover:scale-[1.045]"
    />
  );
}

function LeadTile({ item }: { item: Strength }) {
  return (
    <RevealPart
      as="li"
      className={cn(TILE, "flex flex-col nav:row-span-2")}
    >
      <div className="relative aspect-2/1 max-ph:aspect-16/10 nav:aspect-auto nav:min-h-0 nav:grow">
        <Photo item={item} sizes="(min-width: 1141px) 54vw, 100vw" />
        <NumBadge num={item.num} />
      </div>
      <div className="px-7.5 pt-6.5 pb-7.5 max-ph:px-5 max-ph:pt-4.5 max-ph:pb-5">
        <h3 className="text-h3 mb-2.5">{item.title}</h3>
        <p className="text-ink-soft max-w-[52ch]">{item.body}</p>
      </div>
    </RevealPart>
  );
}

function SideTile({ item }: { item: Strength }) {
  return (
    <RevealPart
      as="li"
      className={cn(
        TILE,
        "grid grid-cols-[0.9fr_1fr] max-ph:grid-cols-[120px_minmax(0,1fr)]",
      )}
    >
      <div className="relative min-h-45 max-ph:min-h-0">
        <Photo item={item} sizes="(min-width: 1141px) 22vw, 45vw" />
        <NumBadge num={item.num} small />
      </div>
      <div className="flex flex-col justify-center px-6 py-5.5 max-ph:px-4 max-ph:pt-4 max-ph:pb-4.5">
        <h3 className="mb-2 text-[1.3rem] leading-tight font-bold max-ph:text-[1.08rem]">
          {item.title}
        </h3>
        <p className="text-ink-soft text-[0.92rem] max-ph:text-[0.86rem]">
          {item.body}
        </p>
      </div>
    </RevealPart>
  );
}

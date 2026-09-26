import Image from "next/image";
import { Kicker } from "@/components/primitives/kicker";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { events, eventsHead } from "@/content";

/**
 * Laid out like a concert programme: when, what, and a small photo, one
 * line per event under a heavy top rule. The date leads because it is
 * what a parent is planning around, and it used to be the smallest
 * text in the row.
 *
 * It replaces three photo/text rows with a full-size photo each:
 * 1,656px at 1440 and 2,373px at 900, where every photo went full
 * width.
 *
 * Below `tb` the date drops to a single line above the title and the
 * photo moves to the right, spanning both.
 */
export default function EventsSection() {
  return (
    <Section id="events" tone="panel">
      <StaffDivider />

      <Reveal>
        <RevealPart className="mb-9 max-w-[min(820px,92%)]">
          <Kicker>{eventsHead.kicker}</Kicker>
          <h2 className="text-h2">{eventsHead.heading}</h2>
        </RevealPart>

        <ul className="border-ink border-t-2">
          {events.map((item) => (
            <RevealPart
              key={item.slug}
              as="li"
              className="border-line group grid grid-cols-[clamp(150px,17vw,220px)_minmax(0,1fr)_clamp(180px,19vw,240px)] items-center gap-x-gap-sm border-b py-5.5 max-tb:grid-cols-[minmax(0,1fr)_120px] max-tb:gap-x-4 max-tb:gap-y-1.5 max-tb:py-4.5 max-ph:grid-cols-[minmax(0,1fr)_104px]"
            >
              <p className="flex flex-col gap-0.5 max-tb:flex-row max-tb:items-baseline max-tb:gap-2">
                <span className="text-brand-ink text-[clamp(1.35rem,2.3vw,1.9rem)] leading-tight font-bold max-tb:text-[1.05rem]">
                  {item.when.main}
                </span>
                <span className="text-ink-soft text-[0.88rem] max-tb:text-[0.82rem]">
                  {item.when.sub}
                </span>
              </p>

              <div className="max-tb:col-start-1 max-tb:row-start-2">
                <h3 className="text-h3-event mb-1.5">{item.title}</h3>
                <p className="text-ink-soft max-w-[58ch] text-[0.95rem] max-ph:text-[0.86rem]">
                  {item.body}
                </p>
              </div>

              <div className="rounded-thumb bg-placeholder relative aspect-12/7 overflow-hidden max-tb:col-start-2 max-tb:row-span-2 max-tb:row-start-1 max-tb:aspect-auto max-tb:h-full max-tb:min-h-24">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 720px) 120px, 240px"
                  loading="lazy"
                  className="duration-1300 ease-kawai object-cover transition-transform group-hover:scale-[1.045]"
                />
              </div>
            </RevealPart>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

import Image from "next/image";
import { Kicker } from "@/components/primitives/kicker";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { events, eventsHead } from "@/content";

export default function EventsSection() {
  return (
    <Section id="events" tone="panel">
      <StaffDivider />

      <Reveal>
        <RevealPart className="mb-head max-w-[min(820px,92%)]">
          <Kicker>{eventsHead.kicker}</Kicker>
          <h2 className="text-h2">{eventsHead.heading}</h2>
        </RevealPart>

        <div className="grid">
          {events.map((item, i) => (
            <RevealPart
              key={item.slug}
              as="article"
              className={`border-line py-row-event group grid grid-cols-[minmax(0,1fr)_minmax(320px,520px)] items-center gap-gap-hilite border-t max-dt:grid-cols-1 ${
                i === events.length - 1 ? "border-b" : ""
              }`}
            >
              <div>
                <div className="text-brand-ink mb-2.5 block font-mono text-[0.74rem] tracking-[0.12em] whitespace-nowrap">
                  {item.when}
                </div>
                <h3 className="text-h3-event mb-2.5">{item.title}</h3>
                <p className="text-ink-soft max-w-[52ch] text-[0.96rem]">
                  {item.body}
                </p>
              </div>
              <div className="rounded-tile bg-placeholder overflow-hidden max-dt:order-first">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  sizes="(max-width: 980px) 100vw, min(520px, 45vw)"
                  loading="lazy"
                  className="duration-[1300ms] ease-kawai aspect-video h-auto w-full object-cover transition-transform group-hover:scale-[1.045]"
                />
              </div>
            </RevealPart>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

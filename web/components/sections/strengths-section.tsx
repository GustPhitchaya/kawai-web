import Image from "next/image";
import { Kicker } from "@/components/primitives/kicker";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { strengths, strengthsHead } from "@/content";

export default function StrengthsSection() {
  return (
    <Section className="border-line border-t">
      <Reveal>
        <RevealPart className="mb-head">
          <Kicker>{strengthsHead.kicker}</Kicker>
          <h2 className="text-h2">{strengthsHead.heading}</h2>
        </RevealPart>

        {strengths.map((item, i) => (
          <RevealPart
            key={item.num}
            as="article"
            className={`border-line py-row group grid grid-cols-[1.04fr_0.96fr] items-center gap-gap-md border-b max-dt:grid-cols-1 ${
              i === strengths.length - 1 ? "border-b-0 pb-0" : ""
            }`}
          >
            <div
              className={`rounded-strength shadow-panel bg-placeholder overflow-hidden ${
                item.flip ? "order-2 max-dt:order-none" : ""
              }`}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                sizes="(max-width: 980px) 100vw, 48vw"
                loading="lazy"
                className="duration-[1300ms] ease-kawai aspect-[16/10] h-auto w-full object-cover transition-transform group-hover:scale-[1.045]"
              />
            </div>
            <div>
              <div className="text-num text-brand duration-500 ease-kawai mb-[14px] font-mono font-medium opacity-30 transition-opacity group-hover:opacity-[0.62]">
                {item.num}
              </div>
              <h3 className="text-h3 mb-[14px]">{item.title}</h3>
              <p className="text-ink-soft max-w-[46ch]">{item.body}</p>
            </div>
          </RevealPart>
        ))}
      </Reveal>
    </Section>
  );
}

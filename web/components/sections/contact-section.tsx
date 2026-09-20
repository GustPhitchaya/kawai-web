import { CtaButton } from "@/components/primitives/cta-button";
import { Icon } from "@/components/primitives/icon";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { contact } from "@/content";

export default function ContactSection() {
  const { head, lineBlock, waysTitle, ways, waysNote } = contact;

  return (
    <Section id={contact.id} tone="deep">
      <StaffDivider tone="deep" />

      <Reveal>
        <RevealPart>
          <SectionHead
            content={head}
            tone="deep"
            headingClassName="text-h2-contact"
            className="mb-0"
          />
        </RevealPart>

        <div className="mt-head grid grid-cols-2 items-start gap-[clamp(32px,5vw,80px)] max-dt:grid-cols-1">
          <RevealPart>
            <div className="rounded-card border-line-on-deep p-panel-sm border bg-white/5">
              <div className="text-tag text-brand-light mb-[14px] font-mono tracking-[0.2em] uppercase">
                {lineBlock.tag}
              </div>
              <h3 className="text-h3-line mb-2.5 text-white">
                {lineBlock.heading}
              </h3>
              <p className="mb-[22px] text-[0.96rem] text-on-deep-muted">
                {lineBlock.body}
              </p>
              <CtaButton cta={lineBlock.cta} />
            </div>
          </RevealPart>

          <RevealPart>
            <h3 className="text-waystitle mb-[18px] text-white">{waysTitle}</h3>
            <div className="rounded-grid mt-[26px] grid gap-px overflow-hidden border border-white/10 bg-white/10">
              {ways.map((way) => (
                <a
                  key={way.label}
                  href={way.href}
                  {...(way.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="bg-deep-1 duration-[400ms] ease-kawai group flex items-center gap-[13px] px-5 py-4 no-underline transition-colors hover:bg-deep-2"
                >
                  <Icon
                    name={way.icon}
                    className="text-brand-light duration-[400ms] ease-kawai text-[1.16rem] opacity-90 transition-transform group-hover:translate-x-0.5"
                  />
                  <span className="text-label w-[100px] flex-none font-mono tracking-[0.16em] text-on-deep-muted uppercase">
                    {way.label}
                  </span>
                  <span className="text-on-deep text-[0.96rem] break-all">
                    {way.value}
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-5 max-w-[44ch] text-[0.92rem] leading-[1.75] text-on-deep-muted">
              {waysNote}
            </p>
          </RevealPart>
        </div>
      </Reveal>
    </Section>
  );
}

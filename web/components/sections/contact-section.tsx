import { CtaButton } from "@/components/primitives/cta-button";
import { Icon } from "@/components/primitives/icon";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { contact } from "@/content";

/**
 * LINE is the channel that books a trial class, so it gets the full
 * width, with what happens after tapping the button drawn as three
 * numbered steps. The other four ways sit underneath as equal tiles:
 * secondary, but each one is a whole tap target.
 *
 * This replaces two columns that started at different heights and
 * ended at different heights, with the LINE button as the smallest
 * thing in a mostly empty card.
 */
export default function ContactSection() {
  const { head, lineBlock, waysTitle, ways, waysNote, branchesLink } = contact;

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

        <RevealPart className="rounded-card bg-deep-2 border-brand-light/30 mt-head px-panel-sm flex items-center gap-9 border py-7.5 max-dt:flex-col max-dt:items-start max-dt:gap-6">
          <div className="grow">
            <div className="text-tag text-brand-light mb-2.5 tracking-[0.18em]">
              {lineBlock.tag}
            </div>
            <h3 className="text-h3-line mb-3.5 text-white">
              {lineBlock.heading}
            </h3>
            <ol className="text-on-deep flex flex-wrap items-center gap-3 text-[0.92rem] max-tb:flex-col max-tb:items-start">
              {lineBlock.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="text-on-deep-faint max-tb:hidden"
                    >
                      —
                    </span>
                  ) : null}
                  <span className="flex items-center gap-2">
                    <span className="bg-brand grid size-5.5 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold text-white">
                      {i + 1}
                    </span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2.5 max-dt:items-start">
            <CtaButton cta={lineBlock.cta} size="pillLg" />
            <span className="text-on-deep-muted text-[0.82rem]">
              {lineBlock.handle}
            </span>
          </div>
        </RevealPart>

        <RevealPart className="mt-4.5">
          <h3 className="sr-only">{waysTitle}</h3>
          <ul className="grid grid-cols-4 gap-3.5 max-nav:grid-cols-2 max-ph:grid-cols-1">
            {ways.map((way) => (
              <li key={way.label}>
                <a
                  href={way.href}
                  {...(way.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="rounded-grid bg-deep-1 border-line-on-deep duration-400 ease-kawai group flex h-full flex-col gap-3.5 border p-5 no-underline max-ph:flex-row max-ph:items-center max-ph:gap-4 max-ph:px-4.5 max-ph:py-3.5 transition-colors hover:border-brand-light/40 hover:bg-deep-2"
                >
                  <Icon
                    name={way.icon}
                    className="text-brand-light duration-400 ease-kawai text-[1.35rem] transition-transform group-hover:-translate-y-0.5"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-on-deep-muted text-[0.8rem]">
                      {way.label}
                    </span>
                    <span className="text-on-deep text-[0.96rem] font-medium break-all">
                      {way.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </RevealPart>

        <RevealPart className="mt-5.5 text-[0.92rem]">
          <a
            href={branchesLink.href}
            className="group inline-flex flex-wrap items-center gap-2.5 no-underline"
          >
            <span className="text-on-deep-muted">{waysNote}</span>
            <span className="text-brand-light font-medium">
              {branchesLink.label}{" "}
              <span
                aria-hidden="true"
                className="duration-400 ease-kawai inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </a>
        </RevealPart>
      </Reveal>
    </Section>
  );
}

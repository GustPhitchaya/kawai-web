import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { HarmonyInteractive } from "./harmony-interactive";
import { harmony } from "@/content";

/** Server shell; only the hold-to-play island below is client code. */
export default function HarmonySection() {
  return (
    <Section id={harmony.id} tone="deep">
      <StaffDivider tone="deep" />

      <Reveal>
        <RevealPart>
          <SectionHead content={harmony.head} tone="deep" className="mb-0" />
        </RevealPart>
        <RevealPart className="mt-head">
          <HarmonyInteractive />
        </RevealPart>
      </Reveal>
    </Section>
  );
}

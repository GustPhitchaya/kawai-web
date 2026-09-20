import { Icon } from "@/components/primitives/icon";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { branchGroups, branchesHead } from "@/content";

/** Column counts per region, collapsing the same way the draft did. */
const COLUMNS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2 max-tb:grid-cols-1",
  3: "grid-cols-3 max-dt:grid-cols-2 max-tb:grid-cols-1",
};

export default function BranchesSection() {
  return (
    <Section id="branches" tone="panel">
      <StaffDivider />

      <Reveal>
        <RevealPart>
          <SectionHead content={branchesHead} className="mb-0" />
        </RevealPart>

        {branchGroups.map((group, i) => (
          <RevealPart
            key={group.id}
            className={i === 0 ? "mt-head" : "mt-group"}
          >
            <h3 className="group-rule text-brand-ink mb-5 flex items-center gap-[14px] font-mono text-[0.76rem] font-medium tracking-[0.2em] uppercase">
              {group.region}
            </h3>
            <div
              className={`bg-line border-line rounded-grid grid gap-px overflow-hidden border ${COLUMNS[group.columns]}`}
            >
              {group.branches.map((branch) => (
                <div
                  key={branch.slug}
                  className="bg-panel p-branch duration-[450ms] ease-kawai group flex items-start gap-[13px] transition-colors hover:bg-canvas"
                >
                  <Icon
                    name="pin"
                    className="text-brand duration-[450ms] ease-kawai mt-0.5 text-[1.15rem] opacity-50 transition-[opacity,transform] group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                  <div>
                    <b className="font-display mb-[5px] block text-[1.02rem] font-semibold">
                      {branch.name}
                    </b>
                    <span className="text-ink-soft text-[0.88rem]">
                      {branch.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </RevealPart>
        ))}
      </Reveal>
    </Section>
  );
}

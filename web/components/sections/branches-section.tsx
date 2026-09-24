import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { SectionHead } from "@/components/primitives/section-head";
import { StaffDivider } from "@/components/primitives/staff-divider";
import { branchGroups, branchesHead } from "@/content";
import type { Branch } from "@/content/types";

/**
 * The region name used to be a full-width heading bar above a grid
 * whose column count came from the data, so ภาคเหนือ's single branch
 * stretched across the whole 1,220px wrap and ภาคตะวันออก left half a
 * row empty — three provincial branches took roughly the vertical room
 * of the nine in Bangkok.
 *
 * Now the region is a narrow rail beside one shared three-column grid,
 * so a region of one costs one cell. Every card is a link to the
 * branch on the map, which is what a pin was only ever implying: twelve
 * identical pins distinguished nothing, so they are gone.
 */
export default function BranchesSection() {
  return (
    <Section id="branches" tone="panel">
      <StaffDivider />

      <Reveal>
        <RevealPart>
          <SectionHead content={branchesHead} />
        </RevealPart>

        {branchGroups.map((group) => (
          <RevealPart
            key={group.id}
            className="border-line grid grid-cols-[190px_1fr] gap-x-gap-sm gap-y-3 border-t py-4 first:border-t-0 first:pt-0 max-dt:grid-cols-1"
          >
            <div className="max-dt:flex max-dt:items-baseline max-dt:gap-3">
              <h3 className="text-brand-ink font-mono text-[0.76rem] font-medium tracking-[0.2em] uppercase">
                {group.region}
              </h3>
              <p className="text-ink-soft mt-1 text-[0.82rem] max-dt:mt-0">
                {group.branches.length} สาขา
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-tb:grid-cols-2 max-ph:grid-cols-1">
              {group.branches.map((branch) => (
                <BranchCard key={branch.slug} branch={branch} />
              ))}
            </div>
          </RevealPart>
        ))}
      </Reveal>
    </Section>
  );
}

/**
 * Falls back to a Maps search on the branch name, which resolves for
 * every one of these mall locations. A `mapUrl` in the content file
 * wins where a real place link is known.
 */
function mapHref(branch: Branch) {
  if (branch.mapUrl) return branch.mapUrl;
  const query = `KAWAI Music School ${branch.name}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <a
      href={mapHref(branch)}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-canvas border-line rounded-tile duration-[450ms] ease-kawai group relative flex flex-col gap-1.5 border p-[15px] transition-[transform,border-color,box-shadow] hover:border-brand hover:-translate-y-0.5 hover:shadow-panel"
    >
      <b className="font-display block pr-5 text-[1.02rem] font-semibold">
        {branch.name}
      </b>

      {/* Fixed slots, so a branch with only a floor still lines up with
          one that has both. */}
      <span className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {branch.floor ? (
          // A white chip on the warm card, not the brand-tinted `chip`
          // Pill: brand red on brand-muted over `canvas` lands at 4.47,
          // a hair under AA at this size.
          <span className="bg-panel border-line text-brand-ink rounded-pill border px-2.5 py-0.5 text-[0.78rem] font-bold">
            {branch.floor}
          </span>
        ) : null}
        {branch.area ? (
          <span className="text-ink-soft text-[0.85rem]">{branch.area}</span>
        ) : null}
      </span>

      <ArrowUpRight
        className="text-ink-soft duration-[450ms] ease-kawai absolute top-[13px] right-[13px] size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      />
      <span className="sr-only">เปิดแผนที่</span>
    </a>
  );
}

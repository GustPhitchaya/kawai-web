import { Button } from "@/components/ui/button";

/**
 * Temporary token proof-sheet. Delete before launch (Phase 9).
 * Renders every design-system token so it can be eyeballed against
 * draft2/KAWAI Music School-draft2.html side by side.
 */

const colors = [
  ["canvas", "bg-canvas"],
  ["panel", "bg-panel"],
  ["deep", "bg-deep"],
  ["brand", "bg-brand"],
  ["brand-hover", "bg-brand-hover"],
  ["brand-muted", "bg-brand-muted"],
  ["brand-light", "bg-brand-light"],
  ["brand-ink", "bg-brand-ink"],
  ["ink", "bg-ink"],
  ["ink-soft", "bg-ink-soft"],
  ["line", "bg-line"],
  ["line-strong", "bg-line-strong"],
  ["line-btn", "bg-line-btn"],
  ["placeholder", "bg-placeholder"],
  ["deep-1", "bg-deep-1"],
  ["deep-2", "bg-deep-2"],
];

const typeScale = [
  ["text-h1", "text-h1"],
  ["text-h1-static", "text-h1-static"],
  ["text-h2", "text-h2"],
  ["text-h2-contact", "text-h2-contact"],
  ["text-h3", "text-h3"],
  ["text-lead", "text-lead"],
  ["text-payoff", "text-payoff"],
  ["text-idle", "text-idle"],
  ["text-pillword", "text-pillword"],
  ["text-num", "text-num"],
  ["text-head-lead", "text-head-lead"],
  ["text-sub", "text-sub"],
  ["text-body", "text-body"],
];

const radii = [
  ["pill", "rounded-pill"],
  ["strength 22", "rounded-strength"],
  ["card 20", "rounded-card"],
  ["tile 18", "rounded-tile"],
  ["grid 16", "rounded-grid"],
  ["thumb 14", "rounded-thumb"],
  ["nav 10", "rounded-nav"],
];

const spacing = [
  ["gutter", "w-gutter"],
  ["section", "w-section"],
  ["head", "w-head"],
  ["row", "w-row"],
  ["gap-lg", "w-gap-lg"],
  ["gap-md", "w-gap-md"],
  ["gap-sm", "w-gap-sm"],
  ["card", "w-card"],
  ["panel", "w-panel"],
];

function H({ children }: { children: string }) {
  return (
    <h2 className="text-kicker font-mono tracking-[0.22em] text-brand-ink uppercase">
      {children}
    </h2>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto max-w-wrap px-gutter py-16 space-y-16">
      <header className="space-y-2">
        <p className="font-mono text-kicker tracking-[0.22em] text-brand-ink uppercase">
          Design system
        </p>
        <h1 className="text-h2">KAWAI token proof-sheet</h1>
        <p className="text-ink-soft text-head-lead">
          ทดสอบโทเคนทุกตัว — สี ตัวอักษร ระยะ มุมโค้ง เงา และปุ่ม
        </p>
      </header>

      <section className="space-y-4">
        <H>Colors</H>
        <div className="grid grid-cols-2 gap-gap-sm ph:grid-cols-4">
          {colors.map(([name, cls]) => (
            <div key={name} className="space-y-2">
              <div
                className={`${cls} h-16 rounded-thumb border border-line`}
              />
              <code className="font-mono text-label text-ink-soft">{name}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <H>Fonts</H>
        <div className="space-y-3">
          <p className="font-display text-h3 font-bold">
            font-display · Prompt · โรงเรียนสอนดนตรีคาไว 1956
          </p>
          <p className="font-sans text-body">
            font-sans · Noto Sans Thai · ไม่ใช่แค่การเรียนดนตรี
            แต่เป็นการเรียนรู้ผ่านเสียงดนตรี
          </p>
          <p className="font-mono text-kicker tracking-[0.22em] uppercase">
            font-mono · IBM Plex Mono · THE KAWAI SYSTEM
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <H>Type scale</H>
        <div className="space-y-3">
          {typeScale.map(([name, cls]) => (
            <div key={name} className="flex items-baseline gap-4">
              <code className="font-mono text-label text-ink-soft w-40 shrink-0">
                {name}
              </code>
              <span className={`${cls} font-display font-bold`}>
                Personality &amp; Harmony
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <H>Buttons</H>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="brand" size="pill">
            จองเรียนทดลอง
          </Button>
          <Button variant="brand" size="pillSm">
            จองเรียนทดลอง
          </Button>
          <Button variant="ghostOutline" size="pill">
            ดูคอร์สทั้งหมด
          </Button>
          <Button variant="ghostOutline" size="pillSm">
            ดูคอร์สทั้งหมด
          </Button>
        </div>
        <div className="bg-deep rounded-card p-panel flex flex-wrap items-center gap-3">
          <Button variant="brand" size="pill">
            จองเรียนทดลอง
          </Button>
          <Button variant="onDeep" size="pill">
            ดูสาขาใกล้บ้าน
          </Button>
          <Button variant="onDeep" size="pillLg">
            กดค้างไว้
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <H>Radii &amp; shadows</H>
        <div className="flex flex-wrap gap-gap-sm">
          {radii.map(([name, cls]) => (
            <div key={name} className="space-y-2">
              <div
                className={`${cls} bg-panel shadow-panel size-24 border border-line`}
              />
              <code className="font-mono text-label text-ink-soft">{name}</code>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-gap-sm pt-4">
          <div className="bg-panel shadow-panel rounded-card p-card">
            shadow-panel
          </div>
          <div className="bg-brand text-white shadow-brand rounded-pill px-6 py-3">
            shadow-brand
          </div>
          <div className="bg-brand text-white shadow-brand-hover rounded-pill px-6 py-3">
            shadow-brand-hover
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <H>Spacing</H>
        <div className="space-y-2">
          {spacing.map(([name, cls]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="font-mono text-label text-ink-soft w-28 shrink-0">
                {name}
              </code>
              <div className={`${cls} bg-brand-muted h-4 rounded-sm`} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <H>Gate variants</H>
        <p className="text-ink-soft text-sub">
          ย่อหน้าต่างหรือเปิด reduced-motion เพื่อดูการสลับ
        </p>
        <div className="flex flex-wrap gap-gap-sm">
          <div className="bg-brand-muted text-brand-ink rounded-grid px-5 py-3 scrub-off:hidden">
            scrub hero ON (ซ่อนเมื่อ scrub-off)
          </div>
          <div className="bg-brand text-white rounded-grid hidden px-5 py-3 scrub-off:block">
            static hero ON (โชว์เมื่อ scrub-off)
          </div>
          <div className="bg-panel rounded-grid border border-line px-5 py-3 max-nav:hidden">
            max-nav:hidden (ซ่อนต่ำกว่า 1141px)
          </div>
          <div className="bg-panel rounded-grid border border-line px-5 py-3 max-dt:hidden">
            max-dt:hidden (ซ่อนต่ำกว่า 981px)
          </div>
          <div className="bg-panel rounded-grid border border-line px-5 py-3 max-tb:hidden">
            max-tb:hidden (ซ่อนต่ำกว่า 721px)
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <H>Ambient primitives</H>
        <div className="relative flex flex-wrap items-end gap-8">
          <div>
            <div className="piano-keys w-56">
              <i />
              <i className="blk" />
              <i />
              <i className="blk" />
              <i />
              <i />
              <i className="blk" />
              <i />
              <i className="blk" />
              <i />
              <i className="blk" />
              <i />
            </div>
            <code className="font-mono text-label text-ink-soft">
              .piano-keys
            </code>
          </div>
          <div>
            <p className="kicker-rule text-kicker text-brand-ink flex items-center gap-3 font-mono tracking-[0.22em] uppercase">
              Our Philosophy
            </p>
            <code className="font-mono text-label text-ink-soft">
              .kicker-rule
            </code>
          </div>
        </div>
      </section>
    </main>
  );
}

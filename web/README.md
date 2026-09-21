# KAWAI Music School — web

Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui port of
`../draft2/KAWAI Music School-draft2.html`, which stays in the repo as
the visual and behavioural source of truth.

```bash
npm run dev      # http://localhost:3000
npm run build    # catches RSC/client-boundary mistakes dev mode tolerates
npm run lint
npx tsc --noEmit
```

## Design system

Every token lives in [`app/globals.css`](app/globals.css) — nothing else
in the codebase should contain a raw hex value or a bare `clamp()`.

- `:root` holds the raw KAWAI palette (`--kawai-*`) and the shadcn
  semantic layer expressed in terms of it.
- `@theme inline` binds both into Tailwind's namespaces.

**Naming rule:** the brand red is `brand`, never `accent` — shadcn owns
`--accent` as its subtle hover wash. The brand red is mapped onto
`--primary` and `--ring`, so shadcn components inherit the KAWAI look
without edits.

Authoring uses tokens, not arbitrary values:

| Source CSS | Utility |
| --- | --- |
| `padding: clamp(76px,10vw,140px) var(--pad)` | `py-section px-gutter` |
| `max-width: 1220px; margin: 0 auto` | `mx-auto max-w-wrap` |
| `font-size: clamp(1.6rem,3.35vw,2.85rem)` | `text-h2` |
| `color: var(--text-secondary)` | `text-ink-soft` |
| `border-radius: 20px` | `rounded-card` |
| `box-shadow: var(--shadow)` | `shadow-panel` |

### Custom variants

Breakpoints mirror the draft's `max-width` queries: `max-ph` (≤520px),
`max-tb` (≤720px), `max-dt` (≤980px), `max-nav` (≤1140px).

- `scrub-off:` — the five gates that disable the cinematic hero
  (narrow, portrait tablet, portrait touch, short landscape touch,
  reduced motion). `<HeroScrub>` is `scrub-off:hidden` and
  `<HeroStatic>` is `hidden scrub-off:block`, so exactly one is ever on
  screen and the browser only ever downloads one hero image.
- `coarse:` — touch pointers, used for 44px tap targets.
- `short:` — viewports ≤560px tall.

`/styleguide` renders every token as a proof sheet. **Delete it before
launch.**

## Content

All copy lives in [`content/`](content) as typed data, checked with
`satisfies` against [`content/types.ts`](content/types.ts). No Thai
string should be hard-coded in `components/`.

Three files carry placeholder copy from the draft and must be replaced
with real data before launch — find them with:

```bash
grep -rn "@mock" content/
```

They are `events.ts`, `exam-levels.ts` and `testimonials.ts`.

## Motion

Framer Motion (`motion/react`), with `<MotionConfig reducedMotion="user">`
in the root layout so every animation respects the OS setting.

- `<Reveal>` / `<RevealPart>` / `<RevealGroup>` replace the draft's
  `[data-reveal]` observer and its `.part:nth-child()` delay ladder.
  They take `children` straight through, so section content stays
  server-rendered — only the wrapper ships to the client.
- `hero-scrub.tsx` drives the 520vh sticky hero off `useScroll` +
  `useSpring`. Band crossfades use the draft's `smoothstep`, not a
  linear ramp.
- Headline word thresholds come from a **seeded** LCG
  ([`lib/rng.ts`](lib/rng.ts)). Never use `Math.random()` here or the
  hero hydrates with a mismatch.
- `use-chord-synth.ts` must have `ensure()` called synchronously from a
  pointer or key handler. Creating the AudioContext anywhere else is
  blocked by autoplay policy.

Client components: `site-header`, `motion-provider`, `hero-scrub`,
`split-words`, `reveal`, `staff-divider`, `harmony-interactive`, and the
hooks. Everything else is a server component.

## Page rhythm

The page had two peaks — the scrub hero and the harmony scene — and a
long flat run of near-identical card sections between and after them.
Three changes break that up; all of them are about rhythm, not effects.

**Section tone.** `--kawai-canvas` and `--kawai-panel` used to be
`#FAF7F3` and pure `#FFFFFF`, close enough to read as one colour, so
the canvas/panel/deep alternation the sections were already built on
was invisible. They now sit far enough apart to register. Everything
else in the warmth pass — larger radii, larger body text, a warm-toned
shadow — lives in the same `:root` block.

Note `--kawai-canvas-rgb`: the hero veils tint with alpha off that
triple rather than hardcoding the canvas colour, so changing the canvas
can't leave a seam across the hero.

**Statement breaks** (`components/sections/statement-break.tsx`) are
full-width lines at a type scale nothing else on the page uses, placed
between strengths/courses and exam/events. They reuse `SplitWords` with
the block's own scroll progress as the driver. Seeds live in
`content/statements.ts` and must not collide with the hero's 7 and 8.

Reduced motion swaps the *driver*, not the markup — branching the JSX
on `useReducedMotion()` renders one tree on the server and another on
the client, which is React error #418.

**Staff progress** (`components/layout/staff-progress.tsx`) is a fixed
five-line staff at the foot of the viewport. The note's horizontal
position is page progress; its *vertical* position is which section
you're in, stepping between lines as you read. Decorative, so
`aria-hidden` and `pointer-events-none`.

## Courses as a horizontal row

`components/sections/courses-track.tsx` replaces five identical stacked
rows (1,998px of page) with one screen.

It is plain native horizontal scrolling — `snap-x snap-mandatory` on an
`overflow-x-auto` flex row — with one behaviour for every visitor. No
scroll hijacking: moving through the cards never takes over the page's
vertical scroll. That also means the browser scrolls a focused card
into view by itself, so keyboard access needs no code of its own.

Every card is presented identically. There is no "active" card, so
nothing has to be derived from scroll position and there is no state to
keep in sync — the only thing the scroll listener does is decide
whether each arrow is still usable.

Three ways to move through the row. Touch swipes it natively. A mouse
can drag it directly (`hooks/use-drag-scroll.ts`) or step a card at a
time with the arrow buttons, which are hidden under `coarse:` where
swiping is the obvious gesture and disable at each end.

Drag-to-scroll is mouse-only on purpose — touch and pen already pan
with real momentum, and taking those over would replace a good native
gesture with a worse hand-rolled one. Three details keep it from
fighting the browser:

- **Snapping is switched off for the duration of the drag.**
  `snap-mandatory` re-snaps after *every* scroll change, so with it
  left on each `scrollLeft` write is yanked straight back and the row
  feels stuck. Restoring it on release is also what settles the row
  onto a card.
- **The click that follows a drag is swallowed** in the capture phase,
  or letting go over a card follows its link. The flag that does this
  is also cleared on the next `pointerdown`, so a drag whose click
  never arrives can't leave it set and eat someone's real click.
- **Native dragging of images and links is cancelled**, or the browser
  starts a drag-and-drop instead of panning.

Movement under 5px still counts as a click, so a small wobble while
pressing a card's button doesn't swallow it.

Things that will break if touched carelessly:

- The scroller sets `padding-inline` **and** `scroll-padding-inline` to
  the page gutter. `snap-start` aligns a card to the scrollport edge,
  which would slam it flush against the window; the scroll-padding
  moves the snap line inward so every card lands on the same left
  margin the first one starts at. Change one without the other and the
  row stops lining up with the rest of the page.
- The arrow step is measured from the first two cards' `offsetLeft`
  difference, not assumed: the gap is a `clamp()` and the card width
  depends on Thai line breaking.

## The 3D harmony scene

The Harmony section's key row is rendered with three.js + React Three
Fiber on desktop, and falls back to the original CSS keys everywhere
else. It exists to show the thing the copy claims: five notes at
different frequencies converging into one waveform.

- `components/three/harmony-scene.tsx` — the `<Canvas>`, dynamically
  imported with `ssr: false`
- `components/three/harmony-keys-3d.tsx` — the five keys
- `components/three/harmony-waves.tsx` — five note waves plus the sum
- `components/sections/harmony-keys-css.tsx` — the fallback

### Rules that keep it cheap and correct

- **The canvas must stay `pointer-events: none`.** The pointerdown on
  the hold button is what unlocks the AudioContext; a canvas that
  swallows it silently kills all sound.
- **Gate by not mounting, never by CSS.** A hidden `<Canvas>` still
  holds a GL context and runs its frame loop. `hooks/use-scene-enabled.ts`
  requires `min-width: 981px`, `pointer: fine`, no reduced motion, and
  WebGL; `harmony-interactive.tsx` additionally waits for the section to
  scroll into view. That conditional render is what keeps three out of
  every other visitor's network tab.
- **`useMediaQuery` uses `useSyncExternalStore` with a `false` server
  snapshot.** Reading `matchMedia` during render would hydrate wrong.
- **Read `progress.get()` inside `useFrame`.** The MotionValue is passed
  in as a prop; subscribing to it with state would re-render 60×/sec.
- **Colours come from `lib/three-tokens.ts`,** which reads the CSS
  custom properties, so `globals.css` stays the only source of truth.
- Key rise is `layout.baseY + rise`, not `rise` — damping toward a bare
  offset walks the keys off their baseline.

### Cost

Measured with `.next/server/app/index.html` + gzip:

| | raw | gzip |
| --- | --- | --- |
| Initial JS, original | 807.9 KB | 257.0 KB |
| Initial JS, + three | 814.9 KB | 259.5 KB |
| Initial JS, + design work | 828 KB | **263.7 KB** |
| Lazy 3D chunk (desktop, in view only) | 898 KB | 236.8 KB |

That 236.8 KB is three's core renderer; it is never on the critical
path. drei was tried and removed — it tree-shook down to 0.4 KB gzip
here, so `Line2` comes straight from `three/addons` instead.

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to
the live origin. It feeds `metadataBase`, the canonical URL, `og:url`,
the sitemap and the JSON-LD; `app/opengraph-image.jpg` then resolves to
an absolute URL automatically, which is what the draft's manual
"patch og:url before zipping" deploy step was for.

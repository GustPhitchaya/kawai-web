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

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to
the live origin. It feeds `metadataBase`, the canonical URL, `og:url`,
the sitemap and the JSON-LD; `app/opengraph-image.jpg` then resolves to
an absolute URL automatically, which is what the draft's manual
"patch og:url before zipping" deploy step was for.

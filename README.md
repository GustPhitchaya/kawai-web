# KAWAI Music School Thailand — landing page

Information-first landing page for KAWAI Music School Thailand. The interactive
layer exists to keep the page from being boring; the course, exam, event and
branch information is the point.

## Stack

| Layer | Choice | Note |
|---|---|---|
| Runtime | Deno 2 + Vite 6 | `deno task dev` replaces the whole npm-script layer |
| Framework | Svelte 5 (runes) | compiled output, so no virtual DOM competes with the audio scheduler |
| 3D | Three.js | one fullscreen quad and one fragment shader — no meshes, lights or loaders |
| Audio | Web Audio | every voice synthesised; the page ships no audio files |

```bash
deno task dev      # http://localhost:5180
deno task build    # → dist/  (three.js split into its own chunk)
deno task bundle   # → dist/artifact.html, one self-contained page
deno task preview
```

`bundle` re-builds with `inlineDynamicImports` and folds the CSS and JS into a
single file, so the shareable preview is generated from this codebase rather
than maintained beside it.

## How it fits together

- `src/lib/data.ts` — the single source of truth: scale, courses, branches,
  instruments, phone number. Everything else reads from here.
- `src/lib/audio.ts` — the six synthesised voices plus percussion. Additive
  partials for piano, bowed saw for violin, Karplus-Strong for guitar, bandpass
  formants for voice.
- `src/lib/ensemble.svelte.ts` — which instruments are on, and the lookahead
  scheduler that keeps them in time. Note scheduling deliberately does **not**
  go through reactivity: audio timing must never wait on a render.
- `src/lib/field.ts` — the metaball shader. Bodies that drift together merge
  into one form while keeping their colour at the seam, which is the school's
  own sentence rendered rather than illustrated.
- `src/components/Lamp.svelte` — Three.js wrapper around that shader.
- `src/components/Nav.svelte` — the header nav, built as a keyboard.
- `src/components/ScrollSound.svelte` — the scroll-plays-piano engine. It has no
  keyboard of its own; it publishes strikes to `keyboard.svelte.ts` and the nav
  draws them, so there is only ever one piano on the page.
- `src/components/Notes.svelte` — the floating note glyphs.

## Deliberate decisions

**Light, not dark.** The first pass was dark in Lusion's register. The buyer is
a parent choosing a music school for a five-year-old, and on a phone in a mall a
black glowing screen reads as a nightclub. Blob Opera and Chrome Music Lab both
chose light for the same audience.

**Three.js loads after first paint.** It is ~114KB gzipped for what is one
quad, so `Lamp.svelte` is dynamically imported and `three` is a separate chunk.
Critical path is ~28KB gzipped JS; the field fades in a moment later.

**The field renders at 62% resolution** and upscales — invisible on a soft blob,
roughly half the fill cost — and stops entirely once the hero scrolls away.

**One continuous surface.** The field is `position: fixed` behind the entire
document and its bodies migrate as the page advances, so scrolling reads as
travelling across one surface. Sections carry no borders and no alternating
backgrounds — separation comes from spacing, type scale and scroll-scrubbed
reveals whose ranges overlap, so neighbours cross-fade instead of popping.

**The background is playable.** The bodies in the field have real velocity. The
pointer shoves them out of its way and drags them along, so a swipe scatters
them and a fling throws them; a soft spring then walks each one home, so the
field can be stirred but never left in a mess. Knocking a body hard enough
sounds it — pitch from how high it sits on screen, loudness from the hit — with
a per-body cooldown so a fast sweep arpeggiates rather than machine-guns.

Two clamps matter here and should not be removed: `ptr.dx/dy` is capped when it
accumulates (it is only drained by the render loop, so a paused loop would
otherwise bank an enormous single-frame impulse), and body speed is capped each
frame. Without either, a sustained shove launches a body off-screen and the
spring never recovers it.

**The nav is the keyboard — the only one.** It was already an index of the page,
so each section is a white key, ascending left to right, with black keys in the
real 2-3 grouping. The key for the section you are in depresses and takes that
section's colour; scroll notes flash across the same keys. An earlier draft also
put a piano rail down the right-hand edge — it was cut as a duplicate.

Booking is the one **red key** at the end of the board. It opens out of the
keyboard (width, padding and margin easing together) instead of being inserted
into the header, so the row never snaps. The black keys are positioned as a
percentage of the naturals only, inside `.whites`, so the booking key cannot
shift them. On mobile the keyboard stands on its side inside the menu.

**Every sounding note shows itself.** A note glyph is thrown from whatever
played it — the instrument pad, or the key on the rail — sized by the note's
gain and coloured by its source, so the page stays legible with sound off.

**Scroll audio is opt-in.** Every ~130px of scroll crosses a key boundary and
plays the next degree of the D pentatonic; a fling crosses many at once and
comes out as a run rather than a clipped note. Pentatonic means it cannot land
wrong. It is off until the visitor turns it on.

**No cursor-trail effects.** Hover-only, and roughly 70% of this audience is on
a phone. The pointer instead displaces the field directly, which works on touch.

## Content still needed

Marked in the UI with a dashed `ต้องการข้อมูลจริง` tag:

- Whether the trial lesson is free, and what it involves
- Grade Test criteria, fees, exam rounds, downloadable regulations
- Whether a parent attends the lesson; what to prepare at home; mid-term intake
- **Real parent testimonials** — the quotes are layout placeholders, not reviews
- A LINE OA account for the contact CTA
- Licensing for the Coo Chan / Kulu Kulu mascot illustrations
- Photography: every premium reference is carried by real photos of students

<script lang="ts">
  /**
   * The nav is already an index of the page, so it is built as a keyboard:
   * one white key per section, ascending left to right, with black keys in the
   * real 2-3 grouping. Scrolling depresses the key for the section you are in,
   * and — once scroll sound is on — sounds its note as you arrive.
   */
  import { SCALE, INSTRUMENTS } from '../lib/data.ts'
  import { ensemble } from '../lib/ensemble.svelte.ts'
  import { keyboard } from '../lib/keyboard.svelte.ts'
  import * as A from '../lib/audio.ts'

  let { notes, mobile = false, showCta = false, onnavigate }: {
    notes?: { emit: (x: number, y: number, c: string, amp?: number, spin?: number) => void }
    mobile?: boolean
    /** The booking key opens out of the keyboard once the hero is behind you. */
    showCta?: boolean
    onnavigate?: () => void
  } = $props()

  const HUES = INSTRUMENTS.map((i) => i.hex)
  /** Black keys sit on the boundary after white key n. */
  const BLACK_AFTER = [0, 1, 3, 4]

  export const ITEMS = [
    { id: 'about', label: 'เกี่ยวกับเรา', note: 2 },
    { id: 'courses', label: 'คอร์สเรียน', note: 4 },
    { id: 'exam', label: 'การสอบ', note: 6 },
    { id: 'events', label: 'กิจกรรม', note: 8 },
    { id: 'branches', label: 'สาขา', note: 10 },
    { id: 'faq', label: 'คำถามที่พบบ่อย', note: 12 },
  ]

  let active = $state(-1)
  let keyEls: HTMLAnchorElement[] = []

  /* Scrolling plays notes; this is where they are seen. The scroll engine has
     no keyboard of its own, so it publishes strikes and the nav renders them. */
  let seen = 0
  $effect(() => {
    const { seq, lit, amp } = keyboard
    if (mobile || seq === seen || lit < 0) return
    seen = seq
    const el = keyEls[lit]
    if (!el || !notes) return
    const r = el.getBoundingClientRect()
    if (r.width === 0) return           // hidden behind the burger menu
    notes.emit(r.left + r.width / 2, r.bottom - 2, HUES[lit], 0.5 + amp * 0.9, 1)
  })

  function strike(i: number, gain: number) {
    A.resume()
    A.piano(SCALE[ITEMS[i].note], A.now(), gain)
    const el = keyEls[i]
    if (el && notes) {
      const r = el.getBoundingClientRect()
      notes.emit(r.left + r.width / 2, r.bottom - 4, HUES[i], gain * 1.6, 1)
    }
  }

  function onClick(i: number) {
    strike(i, 0.44)
    onnavigate?.()
  }

  $effect(() => {
    if (mobile) return
    let queued = false

    const measure = () => {
      queued = false
      // The section the header is currently sitting over.
      let next = -1
      for (let i = 0; i < ITEMS.length; i++) {
        const el = document.getElementById(ITEMS[i].id)
        if (el && el.getBoundingClientRect().top <= 96) next = i
      }
      if (next === active) return
      const arriving = next > -1 && next !== active
      active = next
      if (arriving && ensemble.scrollSound && A.isRunning()) strike(next, 0.3)
    }

    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(measure) } }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll, { passive: true })
    queued = true
    requestAnimationFrame(measure)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  })
</script>

<nav class={mobile ? 'mkeys' : 'keys'} aria-label="ส่วนต่าง ๆ ของหน้า">
  <span class={mobile ? 'contents' : 'whites'}>
    {#each ITEMS as item, i}
      <a
        class="wk" class:on={!mobile && active === i}
        class:pulse={!mobile && keyboard.lit === i} href="#{item.id}"
        style="--c:{HUES[i]}" bind:this={keyEls[i]}
        aria-current={!mobile && active === i ? 'true' : undefined}
        onclick={() => onClick(i)}
      >{item.label}</a>
    {/each}
    {#if !mobile}
      {#each BLACK_AFTER as b}
        <span class="bk" style="left:{(((b + 1) / ITEMS.length) * 100).toFixed(3)}%"></span>
      {/each}
    {/if}
  </span>

  {#if !mobile}
    <a
      class="wk cta" class:in={showCta} href="#contact"
      tabindex={showCta ? undefined : -1} aria-hidden={!showCta}
      onclick={() => { A.resume(); A.piano(SCALE[0], A.now(), 0.5) }}
    >จองเรียนทดลอง</a>
  {/if}
</nav>

<style>
  /* ── desktop: a keyboard laid into the header ─────────────────── */
  .keys {
    display: none; align-items: stretch; gap: 2px; margin-left: auto;
    padding: 0 3px 4px; border-radius: 0 0 9px 9px;
    background: linear-gradient(#EFE7D8, #F8F3EA 42%);
    box-shadow: inset 0 3px 5px -3px rgba(56, 44, 30, .35);
  }
  @media (min-width: 1000px) { .keys { display: flex; } }
  /* Black keys are positioned as a percentage of the naturals only, so the
     booking key sits outside this group and cannot shift them. */
  .whites { position: relative; display: flex; gap: 2px; }
  .contents { display: contents; }

  .keys .wk {
    position: relative; z-index: 1; display: flex; align-items: flex-end;
    justify-content: center; padding: 12px 15px 11px; min-width: 84px;
    font-size: 14.5px; line-height: 1.2; color: var(--ink-70); white-space: nowrap;
    border: 1px solid #DCD2C0; border-top: 0; border-radius: 0 0 7px 7px;
    background: linear-gradient(#fff 62%, #F7F2E9);
    box-shadow: inset 0 -3px 0 -1px rgba(56, 44, 30, .10);
    transition: transform .12s ease, background .14s, color .14s,
                border-color .14s, box-shadow .14s;
  }
  @media (hover: hover) {
    .keys .wk:hover { color: var(--ink); background: linear-gradient(#fff 55%, #FDF6EE); }
  }
  .keys .wk.on {
    transform: translateY(3px); color: var(--ink); border-color: var(--c);
    background: linear-gradient(color-mix(in srgb, var(--c) 9%, #fff), color-mix(in srgb, var(--c) 20%, #fff));
    box-shadow: inset 0 -4px 0 -1px var(--c), 0 6px 16px -8px var(--c);
  }

  /* A scroll strike flashes the key without disturbing the section it marks. */
  .keys .wk.pulse {
    transform: translateY(2px);
    background: linear-gradient(color-mix(in srgb, var(--c) 26%, #fff), color-mix(in srgb, var(--c) 44%, #fff));
    border-color: var(--c); color: var(--ink);
    box-shadow: inset 0 -4px 0 -1px var(--c), 0 8px 20px -8px var(--c);
    transition: none;
  }

  /* The booking key: the one red key on the board. It opens out of the
     keyboard rather than being inserted into it, so the row never snaps. */
  .keys .cta {
    margin-left: 0; max-width: 0; padding-inline: 0; opacity: 0; overflow: hidden;
    white-space: nowrap; pointer-events: none;
    color: #fff; border-color: #A81B0B;
    background: linear-gradient(var(--shu) 58%, #BE2011);
    box-shadow: inset 0 -4px 0 -1px rgba(0, 0, 0, .26), 0 7px 18px -9px rgba(219, 42, 27, .85);
    transition: max-width .44s cubic-bezier(.22, .8, .28, 1),
                padding-inline .34s ease, margin .34s ease, opacity .28s ease,
                transform .16s ease, filter .16s ease;
  }
  .keys .cta.in {
    max-width: 230px; padding-inline: 19px; margin-left: 7px;
    opacity: 1; pointer-events: auto;
  }
  @media (hover: hover) {
    .keys .cta.in:hover { filter: brightness(1.07); transform: translateY(2px); }
  }
  .keys .cta.in:active { transform: translateY(4px); }
  @media (prefers-reduced-motion: reduce) { .keys .cta { transition-duration: .01ms; } }

  .keys .bk {
    position: absolute; top: 0; z-index: 2; width: 17px; height: 60%;
    transform: translateX(-50%); pointer-events: none; border-radius: 0 0 4px 4px;
    background: linear-gradient(#4A4652, #1B1922);
    box-shadow: 0 3px 5px rgba(0, 0, 0, .32), inset 0 -1px 0 rgba(255, 255, 255, .16);
  }

  /* ── mobile: the same keyboard stood on its side ──────────────── */
  .mkeys { display: flex; flex-direction: column; gap: 3px; padding: 8px 0 16px; }
  .mkeys .wk {
    display: flex; align-items: center; padding: 15px 16px; font-size: 16.5px;
    color: var(--ink); border: 1px solid #DCD2C0; border-left: 5px solid var(--c);
    border-radius: 4px 9px 9px 4px;
    background: linear-gradient(90deg, #fff 70%, #F7F2E9);
    box-shadow: inset -3px 0 0 -1px rgba(56, 44, 30, .09);
  }
</style>

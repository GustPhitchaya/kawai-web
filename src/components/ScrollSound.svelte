<script lang="ts">
  /**
   * Scrolling plays the piano.
   *
   * Every ~130px of scroll crosses a key boundary and plays the next degree of
   * the D pentatonic — down the page ascends, back up descends, and a fling
   * crosses many at once so it comes out as a run rather than a clipped note.
   * Pentatonic means it cannot land wrong.
   *
   * This component has no keyboard of its own: the strikes are published to the
   * keyboard store and drawn by the nav, which is the only piano on the page.
   * All that is rendered here is the switch that turns it on.
   */
  import { SCALE } from '../lib/data.ts'
  import { ensemble } from '../lib/ensemble.svelte.ts'
  import { keyboard } from '../lib/keyboard.svelte.ts'
  import * as A from '../lib/audio.ts'

  let { splash, stir, navKeys = 6 }: {
    splash?: (xr: number, col: [number, number, number]) => void
    stir?: (amount: number) => void
    navKeys?: number
  } = $props()

  const BAND = 130
  let lastBand: number | null = null
  let arpUntil = 0
  let lastY = 0

  function toggle() {
    A.resume()
    ensemble.scrollSound = !ensemble.scrollSound
    if (ensemble.scrollSound) {
      lastBand = Math.floor(scrollY / BAND)
      A.piano(SCALE[5], A.now(), 0.42)
      keyboard.strike(2, 0.8)
    }
  }

  $effect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    lastY = scrollY

    const onScroll = () => {
      const y = scrollY
      const dy = Math.abs(y - lastY)
      lastY = y
      stir?.(Math.min(0.35, dy * 0.01))

      if (!ensemble.scrollSound || !A.isRunning() || reduced) return

      const band = Math.floor(y / BAND)
      lastBand ??= band
      let delta = band - lastBand
      // Smooth scrolling fires dozens of events; without a ceiling on how far
      // ahead notes are queued, the runs stack into a machine gun.
      if (arpUntil - A.now() > 0.38) delta = 0
      if (delta === 0) return

      const dir = Math.sign(delta)
      const n = Math.min(Math.abs(delta), 8)
      const t0 = Math.max(A.now() + 0.012, arpUntil)
      const vel = Math.min(1, dy / 90)

      for (let i = 0; i < n; i++) {
        const step = lastBand + dir * (i + 1)
        const idx = ((step % SCALE.length) + SCALE.length) % SCALE.length
        const when = t0 + i * 0.055
        A.piano(SCALE[idx], when, 0.13 + vel * 0.22)
        const navKey = ((step % navKeys) + navKeys) % navKeys
        setTimeout(
          () => keyboard.strike(navKey, 0.4 + vel * 0.6),
          Math.max(0, (when - A.now()) * 1000),
        )
        if (i % 2 === 0) splash?.(0.5 + (Math.random() - 0.5) * 0.7, [0.94, 0.42 + idx * 0.035, 0.3])
      }
      arpUntil = t0 + n * 0.055
      lastBand = band
    }

    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  })
</script>

<button class="snd" aria-pressed={ensemble.scrollSound} onclick={toggle}>
  <span class="led"></span>
  <span>{ensemble.scrollSound ? 'เสียงเลื่อนหน้า: เปิด' : 'เปิดเสียงตอนเลื่อน'}</span>
</button>

<style>
  .snd {
    position: fixed; right: 14px; bottom: 88px; z-index: 56; display: inline-flex;
    align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: 999px;
    cursor: pointer; background: #fff; border: 2px solid var(--rule); box-shadow: var(--sh);
    font: 400 13.5px/1 'Mitr', sans-serif; color: var(--ink-70);
    transition: border-color .2s, color .2s, box-shadow .2s;
  }
  @media (min-width: 1000px) { .snd { bottom: 22px; } }
  .led {
    width: 9px; height: 9px; border-radius: 50%; background: var(--rule); flex: none;
    transition: background .18s, box-shadow .18s;
  }
  .snd[aria-pressed='true'] { border-color: var(--shu); color: var(--ink); }
  .snd[aria-pressed='true'] .led { background: var(--shu); box-shadow: 0 0 0 4px var(--shu-soft); }
  @media (hover: hover) { .snd:hover { border-color: var(--shu); } }
</style>

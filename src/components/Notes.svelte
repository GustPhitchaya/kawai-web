<script lang="ts">
  /**
   * Floating note glyphs. Every sounding note puts one on screen, sized by how
   * loud it is and coloured by what played it — so the picture stays legible
   * with the sound muted, which is how most people first meet the page.
   */
  const GLYPHS = ['♪', '♫', '♩', '♬', '𝅘𝅥𝅮', '♭']
  const MAX_ON_SCREEN = 44

  let host: HTMLDivElement
  let live = 0

  export function emit(
    x: number, y: number, color: string, amp = 1, spin = 1,
  ): void {
    if (!host || live >= MAX_ON_SCREEN) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = document.createElement('span')
    el.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0]
    const size = 15 + amp * 26
    const dx = (-40 - Math.random() * 90) * spin
    const dy = -70 - Math.random() * 130 - amp * 40

    el.style.cssText =
      `left:${x}px;top:${y}px;color:${color};font-size:${size.toFixed(1)}px;` +
      `--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;` +
      `--rot:${((Math.random() - 0.5) * 90).toFixed(0)}deg;` +
      `--dur:${(1.5 + Math.random() * 0.9).toFixed(2)}s`

    live++
    el.addEventListener('animationend', () => { el.remove(); live-- }, { once: true })
    host.appendChild(el)
  }
</script>

<div class="notes" bind:this={host} aria-hidden="true"></div>

<style>
  .notes { position: fixed; inset: 0; z-index: 58; pointer-events: none; overflow: hidden; }
  .notes :global(span) {
    position: absolute; will-change: transform, opacity; line-height: 1;
    font-family: 'Segoe UI Symbol', 'Apple Symbols', serif;
    text-shadow: 0 2px 10px rgba(255, 255, 255, .85);
    animation: fly var(--dur) cubic-bezier(.16, .62, .32, 1) forwards;
  }
  @keyframes fly {
    0%   { opacity: 0; transform: translate(0, 0) scale(.35) rotate(0); }
    14%  { opacity: 1; transform: translate(calc(var(--dx) * .14), calc(var(--dy) * .16)) scale(1.06) rotate(calc(var(--rot) * .2)); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(.7) rotate(var(--rot)); }
  }
</style>

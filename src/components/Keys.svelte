<script lang="ts">
  import { PLAY_KEYS, NOTE_NAMES, SCALE } from '../lib/data.ts'
  import * as A from '../lib/audio.ts'

  let { splash }: { splash?: (xr: number, col: [number, number, number]) => void } = $props()
  let down = $state(-1)
  const held = new Set<number>()

  function hit(i: number) {
    A.resume()
    A.piano(SCALE[PLAY_KEYS[i].n], A.now(), 0.55)
    down = i
    setTimeout(() => { if (down === i) down = -1 }, 130)
    splash?.((i + 0.5) / PLAY_KEYS.length, [0.94, 0.4 + i * 0.05, 0.28])
  }

  $effect(() => {
    const isTyping = (el: EventTarget | null) =>
      el instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(el.tagName)

    const keydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      const i = PLAY_KEYS.findIndex((k) => k.k === e.key.toUpperCase())
      if (i < 0 || held.has(i)) return
      held.add(i)
      hit(i)
    }
    const keyup = (e: KeyboardEvent) => {
      const i = PLAY_KEYS.findIndex((k) => k.k === e.key.toUpperCase())
      if (i > -1) held.delete(i)
    }
    addEventListener('keydown', keydown)
    addEventListener('keyup', keyup)
    return () => { removeEventListener('keydown', keydown); removeEventListener('keyup', keyup) }
  })
</script>

<div class="keys">
  {#each PLAY_KEYS as k, i}
    <button
      class="key" class:down={down === i} aria-label={NOTE_NAMES[k.n]}
      onpointerdown={(e) => { e.preventDefault(); hit(i) }}
    >{k.k}</button>
  {/each}
</div>

<style>
  .keys { display: flex; gap: 4px; touch-action: manipulation; }
  .key {
    flex: 1 1 0; min-width: 0; min-height: 44px; cursor: pointer;
    border-radius: 4px 4px 10px 10px; border: 1px solid var(--rule);
    background: linear-gradient(#fff, #FBF7F1); box-shadow: 0 2px 0 var(--rule);
    color: var(--ink-45); font: 500 10.5px/1 'IBM Plex Mono', monospace;
    display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px;
    transition: background .08s, transform .06s, color .08s, box-shadow .08s;
  }
  .key.down {
    background: var(--shu); border-color: var(--shu); color: #fff;
    transform: translateY(2px); box-shadow: none;
  }
  @media (hover: hover) { .key:hover { border-color: var(--shu); color: var(--ink); } }
</style>

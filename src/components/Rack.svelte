<script lang="ts">
  import { INSTRUMENTS } from '../lib/data.ts'
  import { ensemble } from '../lib/ensemble.svelte.ts'
  import * as A from '../lib/audio.ts'

  let { hitIndex = -1, variant = 'pad' }: { hitIndex?: number; variant?: 'pad' | 'chip' } = $props()
  const canHover = typeof matchMedia === 'function' &&
    matchMedia('(hover:hover) and (pointer:fine)').matches
</script>

<div class={variant === 'pad' ? 'rack' : 'chips'}>
  {#each INSTRUMENTS as inst, i}
    <button
      class={variant}
      class:hit={hitIndex === i}
      style="--c:{inst.hex}"
      aria-pressed={!!ensemble.active[inst.id]}
      aria-label={inst.en}
      onclick={() => ensemble.toggle(inst.id)}
      onpointerenter={() => canHover && !ensemble.active[inst.id] && A.preview(inst.id)}
    >
      {#if variant === 'pad'}
        <svg class="glyph" viewBox="0 0 26 26" aria-hidden="true">{@html inst.glyph}</svg>
      {:else}
        <span class="sw" style="background:{inst.hex}"></span>
      {/if}
      <span class="nm">{inst.th}</span>
    </button>
  {/each}
</div>

<style>
  .rack { display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px; }
  @media (max-width: 660px) { .rack { grid-template-columns: repeat(3, 1fr); } }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }

  .pad, .chip {
    background: #fff; border: 2px solid var(--rule); cursor: pointer; color: var(--ink-45);
    font: inherit; display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    transition: border-color .2s, background .2s, color .2s, transform .16s;
  }
  .pad { border-radius: 14px; padding: 11px 8px; min-height: 52px; }
  .chip {
    border-radius: 999px; padding: 10px 18px; min-height: 46px;
    font-family: 'Mitr', sans-serif; font-size: 15px; color: var(--ink);
  }
  @media (hover: hover) {
    .pad:hover { border-color: var(--c); color: var(--ink); transform: translateY(-2px); }
    .chip:hover { border-color: var(--c); }
  }
  .pad[aria-pressed='true'], .chip[aria-pressed='true'] {
    border-color: var(--c); color: var(--ink);
    background: color-mix(in srgb, var(--c) 12%, #fff);
  }
  .glyph { width: 22px; height: 22px; flex: none; transition: transform .1s ease; }
  .pad[aria-pressed='true'] .glyph { color: var(--c); }
  .pad.hit .glyph { transform: scale(1.26); }
  .sw { width: 11px; height: 11px; border-radius: 50%; flex: none; }
  .pad .nm { font-family: 'Mitr', sans-serif; font-size: 13px; white-space: nowrap; }
  @media (max-width: 400px) { .pad .nm { display: none; } }
</style>

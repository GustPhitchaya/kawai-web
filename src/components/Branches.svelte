<script lang="ts">
  import { BRANCHES } from '../lib/data.ts'

  let term = $state('')
  const rows = $derived(
    BRANCHES.map((b, i) => ({ name: b[0], region: b[1], n: i + 1 }))
      .filter((r) =>
        !term.trim() ||
        r.name.toLowerCase().includes(term.trim().toLowerCase()) ||
        r.region.toLowerCase().includes(term.trim().toLowerCase())
      ),
  )
</script>

<div class="finder">
  <label for="branch-q">ค้นหาสาขา</label>
  <input
    id="branch-q" type="search" autocomplete="off" bind:value={term}
    placeholder="เช่น CentralwOrld, รังสิต, เชียงใหม่, ชลบุรี"
  />
  <ul aria-live="polite">
    {#each rows as r (r.n)}
      <li><span class="n">{r.n}</span><span>{r.name}</span><span class="rg">{r.region}</span></li>
    {:else}
      <li class="empty">ไม่พบสาขาที่ตรงกับคำค้นหา — ลองพิมพ์ชื่อห้างหรือจังหวัด</li>
    {/each}
  </ul>
</div>

<style>
  .finder {
    background: var(--card); border: 1px solid var(--rule); border-radius: 20px;
    padding: clamp(18px, 2.4vw, 26px); box-shadow: var(--sh);
  }
  label { display: block; font-size: 14px; color: var(--ink-45); margin-bottom: 9px; }
  input {
    width: 100%; min-height: 54px; border: 2px solid var(--rule); border-radius: 14px;
    padding: 0 18px; font: 400 16px/1.4 'IBM Plex Sans Thai', sans-serif;
    color: var(--ink); background: var(--soft-2);
  }
  input::placeholder { color: var(--ink-45); }
  input:focus { border-color: var(--shu); outline: none; background: #fff; }
  ul {
    list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  li {
    display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
    background: var(--soft-2); border: 1px solid var(--rule-soft); border-radius: 14px;
    font-size: 14.8px; line-height: 1.6;
  }
  .n {
    font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: #fff;
    background: var(--shu); width: 24px; height: 24px; border-radius: 50%;
    display: grid; place-items: center; flex: none; margin-top: 2px;
  }
  .rg { margin-left: auto; font-size: 11.5px; color: var(--ink-45); flex: none; padding-left: 8px; }
  .empty { grid-column: 1/-1; color: var(--ink-45); display: block; }
</style>

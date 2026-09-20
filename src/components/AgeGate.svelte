<script lang="ts">
  import { COURSES, PHONE_HREF } from '../lib/data.ts'

  let age = $state(4)
  const course = $derived(COURSES.find((c) => age <= c.max)!)
  const label = $derived(age >= 19 ? '18+' : String(age))
  const unit = $derived(age >= 19 ? 'ปีขึ้นไป' : 'ปี')
</script>

<div class="gate">
  <div>
    <p class="q">เลื่อนเพื่อเลือกอายุของลูก</p>
    <p class="hint">ตั้งแต่ 1 ปี จนถึงผู้ใหญ่</p>
    <div class="out"><b>{label}</b><span>{unit}</span></div>
    <input type="range" min="1" max="19" step="1" bind:value={age} aria-label="อายุของลูก" />
    <div class="ticks"><span>1</span><span>5</span><span>10</span><span>15</span><span>18+</span></div>
  </div>

  <div class="result" aria-live="polite">
    <span class="tag">คอร์สที่แนะนำ</span>
    <h3>{course.name}</h3>
    <p class="th2">{course.th}</p>
    <dl>
      {#each course.facts as [k, v]}
        <div><dt>{k || ' '}</dt><dd>{v}</dd></div>
      {/each}
    </dl>
    <p class="why">{course.why}</p>
    <a class="btn btn-1 btn-s" href={PHONE_HREF}>จองเรียนทดลองคอร์สนี้</a>
  </div>
</div>

<style>
  .gate {
    background: var(--card); border: 1px solid var(--rule); border-radius: 24px;
    padding: clamp(22px, 3vw, 34px); box-shadow: var(--sh);
    display: grid; gap: clamp(20px, 3vw, 34px);
  }
  @media (min-width: 840px) { .gate { grid-template-columns: 1fr 1.15fr; align-items: center; } }
  .q { font-family: 'Mitr', sans-serif; font-size: clamp(19px, 2.2vw, 25px); line-height: 1.45; }
  .hint { margin-top: 8px; font-size: 14.5px; color: var(--ink-45); }
  .out { margin-top: 22px; display: flex; align-items: baseline; gap: 10px; }
  .out b {
    font-family: 'Mitr', sans-serif; font-weight: 500; font-size: 46px; line-height: 1;
    color: var(--shu); font-variant-numeric: tabular-nums;
  }
  .out span { font-size: 15px; color: var(--ink-45); }
  input { width: 100%; margin-top: 16px; accent-color: var(--shu); height: 30px; }
  .ticks {
    display: flex; justify-content: space-between;
    font: 400 11px/1 'IBM Plex Mono', monospace; color: var(--ink-45);
  }
  .result {
    background: var(--soft); border: 1px solid var(--rule); border-radius: 18px;
    padding: clamp(20px, 2.6vw, 28px);
  }
  .tag {
    display: inline-flex; background: var(--shu); color: #fff; font-family: 'Mitr', sans-serif;
    font-size: 13px; padding: 5px 14px; border-radius: 999px;
  }
  h3 { margin-top: 14px; font-size: clamp(21px, 2.6vw, 27px); }
  .th2 { font-size: 15px; color: var(--ink-45); margin-top: 2px; }
  dl { margin: 18px 0 0; display: grid; gap: 9px; }
  dl div {
    display: flex; justify-content: space-between; gap: 14px;
    border-bottom: 1px dashed var(--rule); padding-bottom: 8px; font-size: 14.5px;
  }
  dt { color: var(--ink-45); }
  dd { margin: 0; font-weight: 500; text-align: right; }
  .why { margin-top: 16px; font-size: 14.8px; line-height: 1.82; color: var(--ink-70); }
  .result :global(a) { margin-top: 20px; }
</style>

<script lang="ts">
  import { COURSES, INSTRUMENTS, PHONE, PHONE_HREF } from './lib/data.ts'
  import Rack from './components/Rack.svelte'
  import Keys from './components/Keys.svelte'
  import AgeGate from './components/AgeGate.svelte'
  import Branches from './components/Branches.svelte'
  import ScrollSound from './components/ScrollSound.svelte'
  import Notes from './components/Notes.svelte'
  import Nav from './components/Nav.svelte'

  /** Three.js is ~145KB gzipped for what is one fullscreen quad. Loading it
   *  after first paint keeps the hero copy, CTAs and rack inside the 1.5s
   *  budget; the field fades in a moment later. */
  let Lamp = $state<any>(null)
  let lamp = $state<{ splash: (x: number, c: [number, number, number]) => void
                      stir: (a: number) => void } | undefined>()
  let notes = $state<{ emit: (x: number, y: number, c: string, amp?: number, spin?: number) => void } | undefined>()
  let hitIndex = $state(-1)
  let menuOpen = $state(false)
  let scrolled = $state(false)

  /** Every sounding note throws a glyph off the pad that played it. */
  function onHit(ix: number, amp = 1) {
    hitIndex = ix
    setTimeout(() => { if (hitIndex === ix) hitIndex = -1 }, 110)
    const pad = document.querySelectorAll('.rack button')[ix]
    if (pad && notes) {
      const r = pad.getBoundingClientRect()
      if (r.top < innerHeight && r.bottom > 0) {
        notes.emit(r.left + r.width / 2, r.top + 6, INSTRUMENTS[ix].hex, Math.min(amp, 1.4), -1)
      }
    }
  }

  $effect(() => {
    import('./components/Lamp.svelte').then((m) => { Lamp = m.default })
  })

  $effect(() => {
    const h = () => { scrolled = scrollY > 420 }
    addEventListener('scroll', h, { passive: true })
    return () => removeEventListener('scroll', h)
  })

  const faq = [
    ['คลาสเรียนทดลองมีค่าใช้จ่ายไหม?', 'คำถามนี้คือสิ่งแรกที่ผู้ปกครองอยากรู้ ควรตอบให้ชัดเจนที่สุดในหน้านี้'],
    ['ต้องมีเปียโนที่บ้านหรือเปล่า?', 'คำถามที่พบบ่อยที่สุดสำหรับคอร์สเด็กเล็ก ควรระบุว่าช่วงเริ่มต้นต้องเตรียมอะไรบ้าง'],
    ['ผู้ปกครองต้องเข้าเรียนด้วยไหม?', 'คอร์สเด็กเล็กหลายที่ให้ผู้ปกครองนั่งเรียนด้วย ควรระบุนโยบายของแต่ละหลักสูตร'],
    ['เริ่มเรียนกลางเทอมได้ไหม?', 'ระบุรอบเปิดคอร์สและเงื่อนไขการเข้าเรียนระหว่างเทอม'],
  ]
</script>

<Notes bind:this={notes} />
<ScrollSound splash={(x, c) => lamp?.splash(x, c)} stir={(a) => lamp?.stir(a)} />

<header class="hdr">
  <div class="wrap in">
    <a class="logo" href="#top"><b>KAWAI</b><span>Music School</span></a>
    <Nav {notes} showCta={scrolled} />
    <button class="burger" aria-label="เมนู" aria-expanded={menuOpen} onclick={() => menuOpen = !menuOpen}>
      <i></i><i></i><i></i>
    </button>
  </div>
  {#if menuOpen}
    <div class="mnav wrap">
      <Nav {notes} mobile onnavigate={() => (menuOpen = false)} />
      <a class="btn btn-1" href="#contact" onclick={() => (menuOpen = false)}>ติดต่อเรา</a>
    </div>
  {/if}
</header>

{#if Lamp}
  <div class="lamp-slot"><Lamp bind:this={lamp} hit={onHit} {notes} /></div>
{/if}
<div class="page-scrim" aria-hidden="true"></div>

<section class="hero" id="top">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <span class="eyebrow">ก่อตั้งที่ประเทศญี่ปุ่น ปี 1956</span>
      <h1>ไม่ใช่แค่การเรียนดนตรี แต่เป็นการเรียนรู้ <em>‘ผ่าน’</em> เสียงดนตรี</h1>
      <p class="sub">
        เปียโน คีย์บอร์ด ขับร้อง กลอง กีตาร์ ไวโอลิน และแดนซ์ — หลักสูตรออกแบบตามช่วงวัย
        ตั้งแต่ 1 ปีจนถึงผู้ใหญ่
      </p>
      <div class="acts">
        <a class="btn btn-1" href="#contact">จองคลาสเรียนทดลอง</a>
        <a class="btn btn-2" href="#gate">หาคอร์สที่เหมาะกับลูก</a>
      </div>
      <div class="facts">
        <div><b>12 สาขา</b><span>ทั่วประเทศไทย</span></div>
        <div><b>1 ปี – ผู้ใหญ่</b><span>6 หลักสูตรตามช่วงวัย</span></div>
        <div><b>เปียโนสดทุกคาบ</b><span>ไม่ใช้ซีดีหรือสื่ออิเล็กทรอนิกส์</span></div>
      </div>
    </div>

    <div class="band">
      <div class="band-in">
        <div class="band-hd">
          <span class="t">ลองแตะเล่นดูก่อนก็ได้</span>
          <span class="h">แตะเครื่องดนตรีให้มันเล่นด้วยกัน · เล่นผิดไม่ได้</span>
        </div>
        <Rack {hitIndex} />
        <Keys splash={(x, c) => lamp?.splash(x, c)} />
      </div>
    </div>
  </div>
</section>

<section class="sec" id="about">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">Our Philosophy</span>
      <h2>เราให้ความใส่ใจกับบุคลิกภาพของเด็ก ๆ ทุกคน</h2>
      <p class="lede">
        เด็กทุกคนมีเอกลักษณ์เฉพาะตัว แต่ทุกคนสามารถร่วมกันสร้าง Harmony ที่งดงามได้เมื่อได้มาบรรเลงเสียงเพลงด้วยกัน
        เป้าหมายของเราไม่เพียงแค่ช่วยให้นักเรียนพัฒนาทักษะและฝีมือในการเล่น
        แต่ยังรวมถึงการบ่มเพาะความเป็นตัวตนของพวกเขาผ่านกิจกรรมการแสดงออกของแต่ละหลักสูตร
      </p>
    </div>
    <div class="cards">
      <article class="c"><span class="num">01</span><h3>เอกลักษณ์เฉพาะตัว</h3>
        <p>เราบ่มเพาะบุคลิกภาพที่เป็นเอกลักษณ์ของนักเรียนแต่ละคน และส่งเสริมการแสดงออกถึงตัวตนอย่างมีความสุข ก้าวข้ามมาตรฐานแบบดั้งเดิม</p></article>
      <article class="c"><span class="num">02</span><h3>สภาพแวดล้อมที่ส่งเสริมการเรียนรู้</h3>
        <p>เราจัดเตรียมพื้นที่ที่เอื้อต่อการบ่มเพาะ ให้นักเรียนได้แสดงออกถึงตัวตนอย่างอิสระ และยอมรับชื่นชมในความเป็นเอกลักษณ์ของตนเอง</p></article>
      <article class="c"><span class="num">03</span><h3>ครูบรรเลงเปียโนสดทุกคาบ</h3>
        <p>เราไม่ใช้ซีดีหรือสื่ออิเล็กทรอนิกส์ในการสอน ครูผู้สอนที่เชี่ยวชาญจะบรรเลงเปียโนสดให้เด็กฟังทุกคาบเรียน</p></article>
    </div>
  </div>
</section>

<section class="sec" id="gate">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">เริ่มตรงนี้</span>
      <h2>ลูกอายุเท่าไหร่?</h2>
      <p class="lede">หลักสูตรของ KAWAI ออกแบบตามช่วงวัย เลื่อนแถบด้านล่างแล้วเราจะบอกว่าคอร์สไหนเหมาะกับลูกของคุณ</p>
    </div>
    <AgeGate />
  </div>
</section>

<section class="sec" id="courses">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">Courses</span>
      <h2>คอร์สเรียนทั้งหมด</h2>
      <p class="lede">หลักสูตรหลัก 5 ช่วงวัย บวกหลักสูตรเครื่องดนตรีที่ปรับเนื้อหาให้เหมาะกับระดับฝีมือและแนวเพลงที่ผู้เรียนชื่นชอบ</p>
    </div>
    <div class="courses">
      {#each COURSES as c}
        <article class="course" style="--c:{c.hex}">
          <div class="top"></div>
          <div class="body">
            <div class="hd">
              <div><h3>{c.name}</h3><p class="th2">{c.th}</p></div>
              <span class="age">{c.age}</span>
            </div>
            <dl>
              {#each c.facts as [k, v]}<div><dt>{k || ' '}</dt><dd>{v}</dd></div>{/each}
            </dl>
            <p>{c.why}</p>
          </div>
        </article>
      {/each}
    </div>

    <div class="instr" data-reveal>
      <h3>หลักสูตรเครื่องดนตรี</h3>
      <p>เลือกเครื่องดนตรีเพื่อฟังเสียงในหน้าแรก — และดูว่าเครื่องไหนที่ลูกสนใจ</p>
      <Rack variant="chip" />
    </div>
  </div>
</section>

<section class="sec" id="exam">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">KAWAI Grade Test</span>
      <h2>การสอบวัดระดับ</h2>
      <p class="lede">ระบบวัดระดับของ KAWAI ทำให้ผู้ปกครองเห็นพัฒนาการของลูกเป็นขั้นเป็นตอน และให้นักเรียนมีเป้าหมายที่จับต้องได้ในแต่ละปี</p>
    </div>
    <div class="steps">
      {#each [
        ['Basic', 'พื้นฐานการอ่านโน้ต จังหวะ และการวางมือ สำหรับนักเรียนที่เพิ่งเริ่มต้นเส้นทางดนตรี', 1],
        ['Intermediate', 'เพิ่มความซับซ้อนของบทเพลง การตีความ และการบรรเลงร่วมกับผู้อื่น', 2],
        ['Advanced', 'บทเพลงระดับสูง การแสดงออกทางดนตรีเฉพาะตัว และการเตรียมพร้อมสู่การแสดงบนเวที', 3],
      ] as [name, desc, lvl], i}
        <article class="step">
          <div class="bars">
            {#each [38, 62, 100] as h, b}<i class:on={b < (lvl as number)} style="height:{h}%"></i>{/each}
          </div>
          <span class="lv">Level 0{i + 1}</span>
          <h3>ระดับ {name}</h3>
          <p>{desc}</p>
        </article>
      {/each}
    </div>
    <p class="gap-note" data-reveal>
      <span class="todo">ต้องการข้อมูลจริง</span>
      <span>— เกณฑ์การสอบ ค่าสอบ รอบสอบ และลิงก์ดาวน์โหลดระเบียบการ</span>
    </p>
  </div>
</section>

<section class="sec" id="events">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">Events</span>
      <h2>กิจกรรมและอีเวนท์</h2>
      <p class="lede">การได้ขึ้นเวทีคือส่วนหนึ่งของหลักสูตร ไม่ใช่ของแถม — เพราะการแสดงออกคือสิ่งที่เราต้องการบ่มเพาะ</p>
    </div>
    <div class="cards">
      <article class="c"><span class="num">♪</span><h3>KAWAI Music Recital</h3>
        <p>คอนเสิร์ตประจำปีที่นักเรียนทุกระดับได้ขึ้นแสดงบนเวทีจริง ต่อหน้าครอบครัวและเพื่อน ๆ</p></article>
      <article class="c"><span class="num">♫</span><h3>Workshop สำหรับผู้ปกครองและเด็ก</h3>
        <p>กิจกรรมที่ผู้ปกครองได้เข้ามาเล่นดนตรีร่วมกับลูก และเข้าใจวิธีสนับสนุนการฝึกซ้อมที่บ้าน</p></article>
      <article class="c"><span class="num">♩</span><h3>Music Camp ปิดเทอม</h3>
        <p>ค่ายดนตรีช่วงปิดเทอมที่เน้นการเล่นรวมวง การฟัง และการทำงานร่วมกับเพื่อนใหม่</p></article>
    </div>
  </div>
</section>

<section class="sec" id="branches">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">Branches</span>
      <h2>12 สาขาทั่วประเทศ</h2>
      <p class="lede">ทุกสาขาอยู่ในศูนย์การค้า พิมพ์ชื่อห้างหรือจังหวัดเพื่อค้นหาสาขาที่ใกล้คุณที่สุด</p>
    </div>
    <Branches />
  </div>
</section>

<section class="sec" id="faq">
  <div class="wrap">
    <div class="sec-hd" data-reveal>
      <span class="eyebrow">FAQ</span>
      <h2>คำถามที่ผู้ปกครองถามบ่อย</h2>
    </div>
    <div data-reveal>
      {#each faq as [q, a]}
        <details><summary>{q}</summary><p><span class="todo">ต้องการข้อมูลจริง</span> — {a}</p></details>
      {/each}
      <details>
        <summary>เรียนกี่คนต่อคลาส และคาบละกี่นาที?</summary>
        <p>ขึ้นอยู่กับหลักสูตร — คอร์สเด็กเล็กเรียนกลุ่ม 2–4 คน มีครู 2 ท่าน คาบละ 40–50 นาที
          ส่วน Sound Tree และ Sound Fans เป็นการเรียนเดี่ยว คาบละ 30 นาที
          ดูรายละเอียดทั้งหมดได้ที่หัวข้อ <a href="#courses">คอร์สเรียน</a></p>
      </details>
    </div>
  </div>
</section>

<section class="sec" id="contact">
  <div class="wrap">
    <div class="contact" data-reveal>
      <div>
        <h2>พร้อมเริ่มต้นเส้นทางดนตรีไปกับ KAWAI แล้วหรือยัง?</h2>
        <p>ทักมาสอบถามคอร์สที่เหมาะกับลูกของคุณ หรือจองคลาสเรียนทดลองที่สาขาใกล้บ้านได้เลย</p>
      </div>
      <div class="acts">
        <a class="btn btn-w" href={PHONE_HREF}>โทร {PHONE}</a>
        <a class="btn btn-o" href="#0">ทักแชทผ่าน LINE</a>
        <span class="ph">เปิดทำการตามเวลาศูนย์การค้า</span>
      </div>
    </div>
  </div>
</section>

<footer class="ft">
  <div class="wrap">
    <div class="cols">
      <div><h4>KAWAI Music School Thailand</h4>
        <p>โรงเรียนดนตรีคาไว สำหรับเด็กและผู้ใหญ่<br />ก่อตั้งที่ประเทศญี่ปุ่น ปี 1956</p></div>
      <div><h4>คอร์สเรียน</h4>
        <p>{#each COURSES.slice(0, 4) as c}<a href="#courses">{c.name}</a><br />{/each}</p></div>
      <div><h4>เครื่องดนตรี</h4>
        <p>{#each INSTRUMENTS as i}<a href="#courses">{i.th}</a><br />{/each}</p></div>
      <div><h4>ติดต่อ</h4><p><a href={PHONE_HREF}>{PHONE}</a><br />12 สาขาทั่วประเทศ</p></div>
    </div>
    <div class="base">
      หน้านี้เป็นแบบร่างสำหรับพัฒนา — เสียงทั้งหมดสังเคราะห์สดด้วย Web Audio
      และภาพพื้นหลังเป็น WebGL shader ไม่มีไฟล์เสียงหรือโมเดลใด ๆ ถูกดาวน์โหลด
    </div>
  </div>
</footer>

<div class="sticky">
  <a class="s1" href={PHONE_HREF}>โทรสอบถาม</a>
  <a class="s2" href="#contact">จองเรียนทดลอง</a>
</div>

<style>
  .hdr {
    position: sticky; top: 0; z-index: 60; background: rgba(253, 250, 245, .78);
    backdrop-filter: blur(16px) saturate(1.3);
    box-shadow: 0 1px 0 rgba(56, 44, 30, .07);
  }
  .in { display: flex; align-items: stretch; gap: 20px; height: 78px; }
  .logo, .burger { align-self: center; }
  .logo { display: flex; align-items: baseline; gap: 9px; font-family: 'Mitr', sans-serif; flex: none; }
  .logo b { font-size: 21px; font-weight: 600; color: var(--shu); }
  .logo span { font-size: 11.5px; color: var(--ink-45); font-family: 'IBM Plex Mono', monospace; }
  .burger {
    display: flex; margin-left: auto; width: 48px; height: 48px; align-items: center;
    justify-content: center; flex-direction: column; gap: 5px; background: #fff;
    border: 1px solid var(--rule); border-radius: 12px; cursor: pointer;
  }
  @media (min-width: 1000px) { .burger { display: none; } }
  .burger i { display: block; width: 19px; height: 2px; background: var(--ink); border-radius: 2px; }
  .mnav { display: flex; flex-direction: column; gap: 10px; padding-bottom: 18px; }
  .mnav > :global(.btn) { width: 100%; }

  .lamp-slot { position: fixed; inset: 0; z-index: 0; animation: fadeField 1.1s ease both; }
  /* One wash over the whole field so body copy stays readable everywhere,
     rather than a per-section background that would cut the page into blocks. */
  .page-scrim {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: rgba(253, 250, 245, .80);
  }
  @keyframes fadeField { from { opacity: 0; } to { opacity: 1; } }

  .hero { position: relative; }
  /* The hero lets more of the field through than the rest of the page; this
     lifts the wash back off just behind the headline so the copy still reads. */
  .hero::before {
    content: ''; position: absolute; inset: -60px 0 0; z-index: 0; pointer-events: none;
    background: linear-gradient(180deg, var(--paper) 8%, rgba(253,250,245,.72) 46%,
      rgba(253,250,245,0) 86%);
  }
  @media (min-width: 900px) {
    .hero::before {
      background: linear-gradient(96deg, var(--paper) 18%, rgba(253,250,245,.62) 44%, rgba(253,250,245,0) 68%);
    }
  }
  .hero-in {
    position: relative; z-index: 2; padding-top: clamp(40px, 6.5vw, 84px);
    display: flex; flex-direction: column; min-height: clamp(560px, 74vh, 780px);
  }
  .hero-copy { max-width: min(640px, 100%); }
  .hero h1 { font-size: clamp(31px, 5.1vw, 58px); line-height: 1.24; margin-top: 16px; }
  .hero h1 :global(em) { font-style: normal; color: var(--shu); }
  .sub {
    margin-top: 18px; max-width: min(520px, 100%);
    font-size: clamp(15.5px, 1.6vw, 18px); line-height: 1.8; color: var(--ink-70);
  }
  .acts { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 12px; }
  .facts {
    margin-top: clamp(26px, 3.5vw, 38px); display: flex; flex-wrap: wrap; gap: 10px 30px;
    padding-top: 20px; border-top: 1px solid var(--rule);
  }
  .facts div { display: flex; flex-direction: column; }
  .facts b { font-family: 'Mitr', sans-serif; font-weight: 500; font-size: 21px; line-height: 1.3; }
  .facts span { font-size: 13px; color: var(--ink-45); }

  .band { margin-top: auto; padding: clamp(14px, 2vw, 20px) 0 clamp(16px, 2.4vw, 22px); }
  .band-in {
    background: rgba(255, 255, 255, .82); backdrop-filter: blur(16px) saturate(1.4);
    border: 1px solid rgba(234, 227, 214, .9); border-radius: 20px; box-shadow: var(--sh-lg);
    padding: clamp(11px, 1.5vw, 15px); display: flex; flex-direction: column; gap: 10px;
  }
  .band-hd { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 0 4px; }
  .band-hd .t { font-family: 'Mitr', sans-serif; font-size: 14px; }
  .band-hd .h { font-size: 12.5px; color: var(--ink-45); }

  .instr { margin-top: clamp(34px, 4.5vw, 52px); }
  .instr h3 { font-size: clamp(20px, 2.4vw, 25px); }
  .instr p { margin-top: 10px; color: var(--ink-70); font-size: 15.5px; max-width: 52ch; }
  .gap-note { margin-top: 22px; font-size: 14.5px; color: var(--ink-45); }

  .contact {
    background: var(--shu); color: #fff; border-radius: 26px; padding: clamp(30px, 4.5vw, 60px);
    display: grid; gap: clamp(22px, 3vw, 44px);
  }
  @media (min-width: 820px) { .contact { grid-template-columns: 1.2fr 1fr; align-items: center; } }
  .contact h2 { color: #fff; font-size: clamp(25px, 3.2vw, 38px); line-height: 1.32; }
  .contact p { margin-top: 14px; color: #FFE0DB; font-size: 16.5px; line-height: 1.82; max-width: 36ch; }
  .contact .acts { display: flex; flex-direction: column; gap: 11px; }
  .btn-w { background: #fff; color: var(--shu); font-size: 17px; min-height: 58px; }
  .btn-o {
    background: transparent; color: #fff; border-color: rgba(255,255,255,.5);
    min-height: 58px; font-size: 17px;
  }
  @media (hover: hover) {
    .btn-w:hover { transform: translateY(-2px); }
    .btn-o:hover { border-color: #fff; background: rgba(255,255,255,.12); transform: translateY(-2px); }
  }
  .ph { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #FFD2CB; text-align: center; }

  .sticky {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 70; display: flex; gap: 9px;
    padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
    background: rgba(253, 250, 245, .94); backdrop-filter: blur(14px);
    border-top: 1px solid var(--rule);
  }
  @media (min-width: 1000px) { .sticky { display: none; } }
  .sticky a {
    flex: 1; min-height: 50px; border-radius: 999px; display: flex; align-items: center;
    justify-content: center; font-family: 'Mitr', sans-serif; font-size: 15.5px;
  }
  .sticky .s1 { background: var(--shu); color: #fff; }
  .sticky .s2 { background: #fff; border: 2px solid var(--rule); }

  .ft { position: relative; z-index: 1; padding: clamp(40px, 5vw, 64px) 0; font-size: 14.5px; color: var(--ink-45); line-height: 1.85; }
  .cols {
    display: grid; gap: 26px 40px; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    margin-bottom: 30px;
  }
  .ft h4 { font-family: 'Mitr', sans-serif; font-size: 14.5px; color: var(--ink); margin-bottom: 8px; }
  .ft a { color: var(--ink-70); }
  @media (hover: hover) { .ft a:hover { color: var(--shu); } }
  .base { padding-top: 22px; border-top: 1px solid var(--rule); font-size: 13px; }
</style>

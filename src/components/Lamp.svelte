<script lang="ts">
  /**
   * The lava field, rendered by Three.js as a single fullscreen quad.
   *
   * Deliberately not a scene: no meshes, no lights, no loaders. A photoreal
   * grand piano model would be 4–8MB before textures and would buy nothing this
   * doesn't already do — and the audience is a parent on 4G in a shopping mall.
   */
  import {
    Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer,
  } from 'three'
  import { INSTRUMENTS, SCALE } from '../lib/data.ts'
  import { ensemble } from '../lib/ensemble.svelte.ts'
  import { fragmentShader, vertexShader, MAX_BODIES } from '../lib/field.ts'
  import * as A from '../lib/audio.ts'

  let { hit = () => {}, notes }: {
    hit?: (ix: number, amp: number) => void
    notes?: { emit: (x: number, y: number, c: string, amp?: number, spin?: number) => void }
  } = $props()

  let host: HTMLDivElement
  /** Render at a fraction of device resolution — invisible on a soft blob
   *  field, and roughly half the fill cost. That headroom pays for samples. */
  const RENDER_SCALE = 0.62
  const PTR = MAX_BODIES - 1

  interface Body {
    x: number; y: number; r: number; vx: number; vy: number; heat: number
    col: [number, number, number]; xn: number; yn: number; phase: number; life: number
    /** AudioContext time this body last sounded, for a per-body cooldown */
    lastHit: number
  }

  const bodies: Body[] = Array.from({ length: MAX_BODIES }, () => ({
    x: 0, y: -1.6, r: 0, vx: 0, vy: 0, heat: 0, col: [1, 1, 1],
    xn: 0, yn: 0, phase: Math.random() * 6.283, life: 0, lastHit: 0,
  }))
  INSTRUMENTS.forEach((inst, i) => {
    const b = bodies[i]
    b.col = inst.col
    b.xn = (i - 2.5) / 2.5
    b.yn = i % 2 ? 0.26 : -0.26
    b.x = b.xn; b.y = b.yn; b.r = 0.215; b.heat = 0.3
  })

  const ptr = { x: 0, y: 0, dx: 0, dy: 0, v: 0, on: false, px: 0, py: 0, down: false }
  let churn = 0
  let spread = 0.335
  let visible = true

  export function splash(xr: number, col: [number, number, number]): void {
    let slot = 6, oldest = Infinity
    for (let i = 6; i < PTR; i++) {
      if (bodies[i].life <= 0) { slot = i; break }
      if (bodies[i].life < oldest) { oldest = bodies[i].life; slot = i }
    }
    const b = bodies[slot]
    b.col = col; b.x = (xr - 0.5) * 1.7; b.y = -1.0
    b.vy = 0.0085; b.r = 0.04; b.heat = 1; b.life = 1
  }

  export function stir(amount: number): void {
    churn = Math.min(1, churn + amount)
  }

  const REDUCED_PTR = typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches

  $effect(() => {
    const reduced = REDUCED_PTR
    const renderer = new WebGLRenderer({ antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2) * RENDER_SCALE)
    host.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block',
    })

    const uniforms = {
      uRes: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uChurn: { value: 0 },
      uBlob: { value: Array.from({ length: MAX_BODIES }, () => new Vector2(0, 0).toArray().concat(0)) },
      uCol: { value: new Float32Array(MAX_BODIES * 3) },
      uHeat: { value: new Float32Array(MAX_BODIES) },
    }
    // Flat Float32Arrays upload faster than arrays of Vector3.
    uniforms.uBlob.value = new Float32Array(MAX_BODIES * 3) as never

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    scene.add(new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
      vertexShader, fragmentShader, uniforms,
    })))

    const resize = () => {
      const r = host.getBoundingClientRect()
      renderer.setSize(r.width, r.height, false)
      uniforms.uRes.value.set(
        renderer.domElement.width || 1,
        renderer.domElement.height || 1,
      )
    }
    resize()
    addEventListener('resize', resize)

    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const ny = -((e.clientY - r.top) / r.height - 0.5) * 2
      // Carry the pointer's own motion so a fast swipe flings the bodies
      // rather than just nudging whatever is directly under the cursor.
      const CAP = 0.3
      ptr.dx = Math.max(-CAP, Math.min(CAP, ptr.dx + (nx - ptr.px) * 0.9))
      ptr.dy = Math.max(-CAP, Math.min(CAP, ptr.dy + (ny - ptr.py) * 0.9))
      ptr.v = Math.min(1.6, ptr.v + Math.hypot(nx - ptr.px, ny - ptr.py) * 4.5)
      ptr.px = nx; ptr.py = ny; ptr.x = nx; ptr.y = ny; ptr.on = true
    }
    const onDown = (e: PointerEvent) => { ptr.down = true; A.resume(); onPointer(e) }
    const onUp = () => { ptr.down = false }
    addEventListener('pointermove', onPointer, { passive: true })
    addEventListener('pointerdown', onDown, { passive: true })
    addEventListener('pointerup', onUp, { passive: true })
    addEventListener('pointercancel', onUp, { passive: true })

    // The field runs behind the entire document — one continuous surface is
    // what stops the page reading as a stack of separate blocks. It costs a
    // single fullscreen quad, so the only thing worth pausing for is a hidden tab.
    const onVis = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const t0 = performance.now()
    let raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const t = (now - t0) / 1000
      const slow = reduced ? 0.25 : 1

      // Drain scheduled notes into heat spikes, in sync with what is heard.
      if (A.isRunning()) {
        const at = A.now()
        while (ensemble.queue.length && ensemble.queue[0].t <= at) {
          const ev = ensemble.queue.shift()!
          bodies[ev.ix].heat = Math.min(1.9, bodies[ev.ix].heat + 0.8 * ev.amp)
          bodies[ev.ix].r += 0.02 * ev.amp
          hit(ev.ix, ev.amp)
        }
      }
      churn *= 0.945

      // The more instruments play, the closer the bodies sit, until a full
      // ensemble fuses into one form instead of six separate lamps.
      spread += (0.52 - ensemble.onCount * 0.045 - spread) * 0.03

      const asp = uniforms.uRes.value.x / Math.max(uniforms.uRes.value.y, 1)
      const wide = asp > 1.15
      const tight = spread / 0.52
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      const prog = Math.min(1, scrollY / maxScroll)

      const px = ptr.x * asp
      const REACH = 0.62          // how far the pointer's shove carries
      const at = A.isRunning() ? A.now() : 0

      for (let i = 0; i < 6; i++) {
        const b = bodies[i]
        const inst = INSTRUMENTS[i]
        const on = !!ensemble.active[inst.id]
        b.heat += ((on ? 0.95 : 0.3) - b.heat) * 0.055
        let tgtR = on ? 0.335 : 0.215
        if (inst.id === 'voice' && on) tgtR = 0.375
        if (inst.id === 'drums' && on) tgtR = 0.3
        b.r += (tgtR - b.r) * 0.07

        // Where this body wants to be. Bodies migrate as the page advances, so
        // scrolling reads as travelling across one surface rather than cutting.
        const lift = inst.id === 'drums' ? 0.3 : 1
        const homeY = b.yn + (wide ? -0.1 : -0.6) + (b.heat - 0.3) * 0.55 * lift +
          Math.sin(prog * 3.4 + b.phase) * 0.55
        const u = (b.xn + 1) * 0.5
        const lane = wide ? 0.2 + u * 0.86 * tight : b.xn * 0.58 * tight
        const homeX = (lane + Math.sin(prog * 2.1 + b.phase * 1.7) * 0.3) * asp +
          Math.sin(t * 0.19 * slow + b.phase) * 0.09 * (0.35 + b.heat) +
          Math.sin(t * 1.9 + b.phase * 2) * 0.05 * churn

        // The pointer shoves bodies out of the way and drags them along with
        // it, then a soft spring walks them home — so the field can be stirred
        // but never left in a mess.
        if (ptr.on && !REDUCED_PTR) {
          const dx = b.x - px
          const dy = b.y - ptr.y
          const d = Math.hypot(dx, dy) || 1e-4
          const reach = REACH + b.r
          if (d < reach) {
            const falloff = 1 - d / reach
            const shove = falloff * falloff * (ptr.down ? 0.085 : 0.048)
            b.vx += (dx / d) * shove + ptr.dx * falloff * 0.9
            b.vy += (dy / d) * shove + ptr.dy * falloff * 0.9

            // Knocking a body hard enough sounds it: pitch from how high it
            // sits, loudness from the hit. The background is an instrument.
            const impulse = Math.hypot(ptr.dx, ptr.dy) * Math.sqrt(falloff)
            if (at && impulse > 0.009 && at - b.lastHit > 0.14) {
              b.lastHit = at
              const idx = Math.max(0, Math.min(SCALE.length - 1,
                Math.round(((b.y + 1) / 2) * (SCALE.length - 1))))
              const gain = Math.min(0.44, 0.09 + impulse * 5.5)
              A.strike(inst.id, SCALE[idx], at, gain)
              b.heat = Math.min(1.9, b.heat + 0.7)
              notes?.emit(
                (b.x / asp * 0.5 + 0.5) * innerWidth,
                (0.5 - b.y * 0.5) * innerHeight,
                inst.hex, Math.min(1.3, gain * 3), Math.sign(ptr.dx) || 1,
              )
            }
          }
        }

        b.vx += (homeX - b.x) * 0.0075 * slow
        b.vy += (homeY - b.y) * 0.0080 * slow
        b.vx *= 0.905
        b.vy *= 0.915

        // Terminal speed, or a sustained shove launches a body off-screen and
        // the spring never gets it back.
        const sp = Math.hypot(b.vx, b.vy)
        if (sp > 0.085) { const k = 0.085 / sp; b.vx *= k; b.vy *= k }

        b.x = Math.max(-asp - 0.9, Math.min(asp + 0.9, b.x + b.vx))
        b.y = Math.max(-2, Math.min(2, b.y + b.vy))
      }
      ptr.dx *= 0.78
      ptr.dy *= 0.78

      for (let j = 6; j < PTR; j++) {
        const d = bodies[j]
        if (d.life <= 0) { d.r = 0; continue }
        d.life -= 0.0075
        d.y += d.vy * slow
        d.vy *= 0.997
        d.r = 0.04 * Math.max(d.life, 0) * (0.55 + d.life * 0.75)
        d.heat = d.life
        if (d.life <= 0) d.r = 0
      }

      // The pointer is just another body — hovering and dragging displace the
      // wax rather than triggering a separate effect layer.
      const pb = bodies[PTR]
      pb.x += (ptr.x * asp - pb.x) * 0.14
      pb.y += (ptr.y - pb.y) * 0.14
      pb.r += ((ptr.on ? 0.10 + Math.min(ptr.v, 1) * 0.13 : 0) - pb.r) * 0.12
      pb.heat = 0.9
      if (ptr.v > 0.85 && Math.random() < 0.3) {
        splash((ptr.x * 0.5 + 0.5), [0.94, 0.62, 0.34])   // wake behind a swipe
      }
      ptr.v *= 0.9

      const blob = uniforms.uBlob.value as unknown as Float32Array
      const col = uniforms.uCol.value
      const heat = uniforms.uHeat.value
      for (let k = 0; k < MAX_BODIES; k++) {
        blob[k * 3] = bodies[k].x
        blob[k * 3 + 1] = bodies[k].y
        blob[k * 3 + 2] = Math.max(bodies[k].r, 0)
        col[k * 3] = bodies[k].col[0]
        col[k * 3 + 1] = bodies[k].col[1]
        col[k * 3 + 2] = bodies[k].col[2]
        heat[k] = bodies[k].heat
      }
      uniforms.uTime.value = t
      uniforms.uChurn.value = churn
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onPointer)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointercancel', onUp)
      renderer.dispose()
      renderer.domElement.remove()
    }
  })
</script>

<div class="lamp" bind:this={host} aria-hidden="true"></div>

<style>
  .lamp { position: fixed; inset: 0; z-index: 0; }
</style>

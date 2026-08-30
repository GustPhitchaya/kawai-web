/**
 * The ensemble: which instruments are playing, the lookahead scheduler that
 * keeps them in time, and the queue of note events the visuals read from.
 *
 * `.svelte.ts` so runes work outside a component. Note scheduling deliberately
 * does NOT go through reactivity — audio timing must not wait on a render.
 */
import { INSTRUMENTS, SCALE, STEPS, STEP_DUR, type InstrumentId } from './data.ts'
import * as A from './audio.ts'

export interface NoteEvent {
  /** AudioContext time the note sounds at */
  t: number
  /** index into INSTRUMENTS */
  ix: number
  /** visual weight of the hit */
  amp: number
}

class Ensemble {
  active = $state<Record<string, boolean>>({})
  playing = $state(false)
  /** scroll-driven piano is opt-in — never make noise the visitor didn't ask for */
  scrollSound = $state(false)

  /** Drained by the renderer each frame; not reactive on purpose. */
  readonly queue: NoteEvent[] = []

  #step = 0
  #next = 0
  #timer: ReturnType<typeof setInterval> | null = null

  get onCount(): number {
    return INSTRUMENTS.filter((i) => this.active[i.id]).length
  }

  toggle(id: InstrumentId, force?: boolean): void {
    A.resume()
    this.active[id] = force ?? !this.active[id]
    if (this.active[id]) this.start()
    else if (this.onCount === 0) this.stop()
  }

  start(): void {
    A.audio()
    if (this.playing) return
    this.playing = true
    A.resume().then(() => {
      if (!this.playing) return
      this.#step = 0
      this.queue.length = 0
      this.#next = A.now() + 0.06
      if (this.#timer) clearInterval(this.#timer)
      this.#timer = setInterval(() => this.#tick(), 25)
    })
  }

  stop(): void {
    this.playing = false
    if (this.#timer) clearInterval(this.#timer)
    this.#timer = null
    this.queue.length = 0
  }

  #tick(): void {
    if (!A.isRunning()) return
    const t = A.now()
    // Background tabs throttle setInterval; without this the loop would dump
    // every missed step at once the moment the tab comes back.
    if (t - this.#next > 0.5) {
      this.#next = t + 0.06
      this.#step = 0
      this.queue.length = 0
    }
    while (this.#next < t + 0.12) {
      this.#schedule(this.#step, this.#next)
      this.#next += STEP_DUR
      this.#step = (this.#step + 1) % STEPS
    }
  }

  #schedule(s: number, t: number): void {
    INSTRUMENTS.forEach((inst, ix) => {
      if (!this.active[inst.id]) return
      let fired = false
      let amp = 1

      const note = inst.steps?.[s]
      if (note !== undefined) {
        const f = SCALE[note]
        if (inst.id === 'piano') A.piano(f, t, inst.gain)
        if (inst.id === 'guitar') A.guitar(f, t, inst.gain)
        if (inst.id === 'violin') A.violin(f, t, STEP_DUR * 7, inst.gain)
        if (inst.id === 'voice') A.voice(f, t, STEP_DUR * 7, inst.gain)
        fired = true
        amp = inst.id === 'violin' || inst.id === 'voice' ? 1.5 : 1
      }
      if (inst.id === 'drums') {
        if (inst.kick!.includes(s)) { A.kick(t, inst.gain); fired = true; amp = 1.4 }
        if (inst.snare!.includes(s)) { A.snare(t, inst.gain); fired = true }
        if (inst.hat!.includes(s)) A.hat(t, inst.gain)
      }
      if (inst.id === 'dance') {
        if (inst.clap!.includes(s)) { A.clap(t, inst.gain); fired = true }
        if (inst.sweep!.includes(s)) { A.sweep(t, inst.gain); fired = true; amp = 1.6 }
      }
      if (fired) this.queue.push({ t, ix, amp })
    })
  }
}

export const ensemble = new Ensemble()

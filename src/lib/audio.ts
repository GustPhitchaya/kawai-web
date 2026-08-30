/**
 * Web Audio synthesis for the six instruments KAWAI teaches.
 *
 * Nothing here is sampled — every voice is built from oscillators, filters and
 * noise, so the page ships no audio files at all. Swap `piano()` for a Tone.js
 * Sampler once real KAWAI upright recordings exist; the rest can stay.
 */
import { SCALE, STEP_DUR } from './data.ts'

let ctx: AudioContext | null = null
let master: GainNode
let wet: GainNode
const ksCache = new Map<number, AudioBuffer>()
const noiseCache = new Map<string, AudioBuffer>()

export function audio(): AudioContext {
  if (ctx) return ctx
  const AC = globalThis.AudioContext ?? (globalThis as any).webkitAudioContext
  ctx = new AC() as AudioContext

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -14
  comp.ratio.value = 4
  comp.attack.value = 0.004
  comp.release.value = 0.25

  master = ctx.createGain()
  master.gain.value = 0.85
  master.connect(comp)
  comp.connect(ctx.destination)

  const conv = ctx.createConvolver()
  conv.buffer = impulse(1.9, 2.6)
  wet = ctx.createGain()
  wet.gain.value = 0.19
  wet.connect(conv)
  conv.connect(comp)

  return ctx
}

export function resume(): Promise<void> {
  const c = audio()
  return c.state === 'suspended' ? c.resume() : Promise.resolve()
}

export const isRunning = () => ctx?.state === 'running'
export const now = () => audio().currentTime

function impulse(sec: number, decay: number): AudioBuffer {
  const c = audio(), len = Math.floor(c.sampleRate * sec)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay
  }
  return buf
}

function noise(sec: number): AudioBuffer {
  const key = String(sec)
  const hit = noiseCache.get(key)
  if (hit) return hit
  const c = audio(), len = Math.floor(c.sampleRate * sec)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  noiseCache.set(key, buf)
  return buf
}

/** Additive partials plus a hammer transient. */
export function piano(freq: number, t: number, vol: number): void {
  const c = audio()
  const g = c.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5)
  g.connect(master); g.connect(wet)

  for (const [mult, amp] of [[1, 1], [2, 0.34], [3, 0.14], [4.02, 0.06]]) {
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.value = freq * mult
    const pg = c.createGain()
    pg.gain.value = amp
    o.connect(pg); pg.connect(g)
    o.start(t); o.stop(t + 1.6)
  }

  const n = c.createBufferSource()
  n.buffer = noise(0.03)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'; bp.frequency.value = freq * 4; bp.Q.value = 1.2
  const ng = c.createGain()
  ng.gain.setValueAtTime(vol * 0.18, t)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  n.connect(bp); bp.connect(ng); ng.connect(master)
  n.start(t)
}

/** Bowed sawtooth through a rising lowpass, with delayed vibrato. */
export function violin(freq: number, t: number, dur: number, vol: number): void {
  const c = audio()
  const o = c.createOscillator()
  o.type = 'sawtooth'; o.frequency.value = freq

  const lfo = c.createOscillator(), lg = c.createGain()
  lfo.frequency.value = 5.2
  lg.gain.setValueAtTime(0, t)
  lg.gain.linearRampToValueAtTime(7, t + 0.5)
  lfo.connect(lg); lg.connect(o.detune)
  lfo.start(t); lfo.stop(t + dur + 0.4)

  const f = c.createBiquadFilter()
  f.type = 'lowpass'; f.Q.value = 1.4
  f.frequency.setValueAtTime(freq * 1.4, t)
  f.frequency.linearRampToValueAtTime(freq * 4.5, t + 0.35)

  const g = c.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.28)
  g.gain.setValueAtTime(vol, t + dur - 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25)

  o.connect(f); f.connect(g); g.connect(master); g.connect(wet)
  o.start(t); o.stop(t + dur + 0.3)
}

/** Karplus-Strong plucked string, rendered offline once per pitch. */
function ksBuffer(freq: number): AudioBuffer {
  const key = Math.round(freq)
  const hit = ksCache.get(key)
  if (hit) return hit
  const c = audio(), sr = c.sampleRate
  const N = Math.max(2, Math.round(sr / freq))
  const len = Math.floor(sr * 1.5)
  const buf = c.createBuffer(1, len, sr)
  const d = buf.getChannelData(0)
  const line = new Float32Array(N)
  for (let i = 0; i < N; i++) line[i] = Math.random() * 2 - 1
  let idx = 0
  for (let i = 0; i < len; i++) {
    const cur = line[idx], nxt = line[(idx + 1) % N]
    d[i] = cur
    line[idx] = (cur + nxt) * 0.5 * 0.9955
    idx = (idx + 1) % N
  }
  ksCache.set(key, buf)
  return buf
}

export function guitar(freq: number, t: number, vol: number): void {
  const c = audio()
  const s = c.createBufferSource()
  s.buffer = ksBuffer(freq)
  const f = c.createBiquadFilter()
  f.type = 'lowpass'; f.frequency.value = 3600
  const g = c.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
  s.connect(f); f.connect(g); g.connect(master); g.connect(wet)
  s.start(t); s.stop(t + 1.5)
}

/** Sawtooth through three bandpass formants — an "ah" vowel. */
export function voice(freq: number, t: number, dur: number, vol: number): void {
  const c = audio()
  const o = c.createOscillator()
  o.type = 'sawtooth'; o.frequency.value = freq
  const g = c.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.35)
  g.gain.setValueAtTime(vol, t + dur - 0.4)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.3)
  g.connect(master); g.connect(wet)

  for (const [hz, amp] of [[700, 0.9], [1220, 0.5], [2600, 0.18]]) {
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'; bp.frequency.value = hz; bp.Q.value = 7
    const fg = c.createGain(); fg.gain.value = amp
    o.connect(bp); bp.connect(fg); fg.connect(g)
  }
  o.start(t); o.stop(t + dur + 0.35)
}

export function kick(t: number, vol: number): void {
  const c = audio()
  const o = c.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(135, t)
  o.frequency.exponentialRampToValueAtTime(44, t + 0.11)
  const g = c.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34)
  o.connect(g); g.connect(master)
  o.start(t); o.stop(t + 0.36)
}

export function snare(t: number, vol: number): void {
  const c = audio()
  const n = c.createBufferSource()
  n.buffer = noise(0.22)
  const f = c.createBiquadFilter()
  f.type = 'highpass'; f.frequency.value = 1300
  const g = c.createGain()
  g.gain.setValueAtTime(vol * 0.7, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
  n.connect(f); f.connect(g); g.connect(master); g.connect(wet)
  n.start(t)

  const o = c.createOscillator()
  o.type = 'triangle'; o.frequency.value = 195
  const og = c.createGain()
  og.gain.setValueAtTime(vol * 0.35, t)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
  o.connect(og); og.connect(master)
  o.start(t); o.stop(t + 0.12)
}

export function hat(t: number, vol: number): void {
  const c = audio()
  const n = c.createBufferSource()
  n.buffer = noise(0.06)
  const f = c.createBiquadFilter()
  f.type = 'highpass'; f.frequency.value = 7400
  const g = c.createGain()
  g.gain.setValueAtTime(vol * 0.3, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
  n.connect(f); f.connect(g); g.connect(master)
  n.start(t)
}

export function clap(t: number, vol: number): void {
  const c = audio()
  const offsets = [0, 0.011, 0.023]
  offsets.forEach((off, i) => {
    const n = c.createBufferSource()
    n.buffer = noise(0.1)
    const f = c.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = 1550; f.Q.value = 1.1
    const g = c.createGain()
    g.gain.setValueAtTime(vol * (i === 2 ? 0.8 : 0.45), t + off)
    g.gain.exponentialRampToValueAtTime(0.0001, t + off + (i === 2 ? 0.13 : 0.045))
    n.connect(f); f.connect(g); g.connect(master); g.connect(wet)
    n.start(t + off)
  })
}

export function sweep(t: number, vol: number): void {
  const c = audio()
  const n = c.createBufferSource()
  n.buffer = noise(0.9)
  const f = c.createBiquadFilter()
  f.type = 'bandpass'; f.Q.value = 2.4
  f.frequency.setValueAtTime(420, t)
  f.frequency.exponentialRampToValueAtTime(5200, t + 0.8)
  const g = c.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol * 0.28, t + 0.55)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
  n.connect(f); f.connect(g); g.connect(master); g.connect(wet)
  n.start(t)
}

/** Sound one instrument at a given pitch — used when a body in the field is
 *  knocked, so the background is playable rather than merely decorative. */
export function strike(id: string, freq: number, t: number, gain: number): void {
  switch (id) {
    case 'drums': return kick(t, gain * 1.1)
    case 'dance': return clap(t, gain * 0.9)
    case 'guitar': return guitar(freq, t, gain)
    case 'violin': return violin(freq, t, 0.9, gain * 0.75)
    case 'voice': return voice(freq, t, 0.9, gain * 0.7)
    default: return piano(freq, t, gain)
  }
}

/** A short hover/tap preview of one instrument's character. */
export function preview(id: string): void {
  if (!isRunning()) return
  const t = now()
  switch (id) {
    case 'drums': return kick(t, 0.34)
    case 'dance': return clap(t, 0.26)
    case 'guitar': return guitar(SCALE[7], t, 0.24)
    case 'violin': return violin(SCALE[8], t, STEP_DUR * 2, 0.13)
    case 'voice': return voice(SCALE[5], t, STEP_DUR * 2, 0.11)
    default: return piano(SCALE[10], t, 0.26)
  }
}

/**
 * SoundEngine — สังเคราะห์เสียงทั้งหมดด้วย Web Audio API (ไม่ใช้ไฟล์เสียงภายนอก)
 *
 * กติกาที่ยึดจาก spec:
 * - AudioContext ถูกสร้างครั้งแรก "หลังผู้ใช้กดเปิดเสียง" เท่านั้น (นโยบาย autoplay)
 * - master gain ไม่เกิน 0.15, เสียง UI ย่อยไม่เกิน 0.06
 * - throttle ขั้นต่ำ 60ms ต่อเสียง UI และตัดเสียงเก่าทิ้งเมื่อมีเกิน 8 เสียงพร้อมกัน
 */

const MASTER_GAIN = 0.15;
const MAX_VOICES = 8;
const THROTTLE_MS = 60;

export type NoteOptions = {
  type?: OscillatorType;
  /** ระดับเสียงสูงสุดของโน้ตนี้ (เทียบกับ master) */
  gain?: number;
  /** ความยาวเสียงรวม decay (วินาที) */
  dur?: number;
  /** ระยะ attack (วินาที) */
  attack?: number;
  /** หน่วงก่อนเริ่มเล่น (วินาที) — ใช้ทำ arpeggio */
  delay?: number;
  /** ผสม harmonic ที่ความถี่ 2 เท่า (ค่าเริ่มต้น: ผสม) */
  harmonic?: boolean;
  /** ใส่ vibrato แบบเสียงร้อง */
  vibrato?: boolean;
};

export type NoiseOptions = {
  dur?: number;
  freq?: number;
  gain?: number;
  filter?: BiquadFilterType;
};

/** คำนวณความถี่จากเลข MIDI แทนการ hardcode */
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voices: GainNode[] = [];
  private lastPlay = 0;

  /** เปิด/ปิดเสียงทั้งระบบ — ค่าเริ่มต้นคือปิด */
  private enabled = false;
  /** ผู้ใช้ตั้ง prefers-reduced-motion → ปิดเสียงตกแต่ง แต่คีย์ที่กดเองยังเล่นได้ */
  private reduced = false;

  setEnabled(on: boolean): void {
    this.enabled = on;
  }

  setReduced(on: boolean): void {
    this.reduced = on;
  }

  /** สร้าง AudioContext แบบ lazy + resume ถ้าถูก suspend */
  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** เรียกตอนกดปุ่มเปิดเสียง — ต้องอยู่ใน user gesture */
  unlock(): void {
    this.ensureCtx();
  }

  private throttled(): boolean {
    const t = performance.now();
    if (t - this.lastPlay < THROTTLE_MS) return true;
    this.lastPlay = t;
    return false;
  }

  /** จำกัดจำนวนเสียงที่ดังพร้อมกัน — เสียงเก่าสุดถูกหรี่ทิ้ง */
  private trackVoice(g: GainNode, ctx: AudioContext): void {
    this.voices.push(g);
    if (this.voices.length > MAX_VOICES) {
      const old = this.voices.shift();
      try {
        old?.gain.cancelScheduledValues(ctx.currentTime);
        old?.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.02);
      } catch {
        /* โหนดถูกปลดไปแล้ว — ไม่ต้องทำอะไร */
      }
    }
  }

  /** เล่นโน้ตหนึ่งตัว: oscillator หลัก + harmonic คู่ที่สอง + ADSR แบบเปียโน */
  playNote(midi: number, opts: NoteOptions = {}): void {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;

    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const dur = opts.dur ?? 1.5;
    const peak = opts.gain ?? 0.9;
    const freq = midiToFreq(midi);

    const g = ctx.createGain();
    g.connect(this.master);
    // attack เร็วมาก → decay ยาว (ห้าม ramp ไป 0 เป๊ะ ๆ)
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (opts.attack ?? 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    const osc = ctx.createOscillator();
    osc.type = opts.type ?? "triangle";
    osc.frequency.setValueAtTime(freq, t0);
    osc.connect(g);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);

    if (opts.harmonic !== false) {
      const h = ctx.createOscillator();
      h.type = "sine";
      h.frequency.setValueAtTime(freq * 2, t0);
      const hg = ctx.createGain();
      hg.gain.setValueAtTime(0.3, t0);
      h.connect(hg);
      hg.connect(g);
      h.start(t0);
      h.stop(t0 + dur + 0.05);
    }

    if (opts.vibrato) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5.5;
      const lg = ctx.createGain();
      lg.gain.value = 6;
      lfo.connect(lg);
      lg.connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t0 + dur);
    }

    this.trackVoice(g, ctx);
  }

  /** เสียง noise แบบสั้น — ใช้ทำกลอง, swoosh ของเมนู */
  playNoise(opts: NoiseOptions = {}): void {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;

    const dur = opts.dur ?? 0.18;
    const buf = ctx.createBuffer(
      1,
      Math.ceil(ctx.sampleRate * dur),
      ctx.sampleRate,
    );
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = opts.filter ?? "lowpass";
    flt.frequency.value = opts.freq ?? 900;
    const g = ctx.createGain();
    g.gain.value = opts.gain ?? 0.5;

    src.connect(flt);
    flt.connect(g);
    g.connect(this.master);
    src.start();
    this.trackVoice(g, ctx);
  }

  /** เสียง UI ย่อย ๆ (hover เมนู, hover การ์ด) — เบามาก + throttle */
  ui(midi: number): void {
    if (this.reduced) return;
    if (this.throttled()) return;
    this.playNote(midi, {
      type: "sine",
      gain: 0.06,
      dur: 0.11,
      harmonic: false,
    });
  }

  /** เสียง click สั้นแบบ marimba — ใช้กับ tab / filter */
  marimba(): void {
    this.playNote(76, { type: "sine", gain: 0.09, dur: 0.28 });
  }

  /** เล่นหลายโน้ตพร้อมกัน หรือไล่ขึ้นถ้าใส่ stagger */
  chord(midis: number[], opts: NoteOptions & { stagger?: number } = {}): void {
    const { stagger = 0, ...rest } = opts;
    midis.forEach((m, i) => {
      this.playNote(m, {
        gain: 0.55,
        dur: 1.6,
        ...rest,
        delay: (rest.delay ?? 0) + stagger * i,
      });
    });
  }

  /** เสียงประจำเครื่องดนตรีแต่ละชนิดใน icon grid */
  playInstrument(kind: string): void {
    switch (kind) {
      case "piano":
        this.playNote(60, { gain: 0.9, dur: 1.5 });
        break;
      case "drums":
        this.playNoise({ dur: 0.22, freq: 400, gain: 0.55 });
        break;
      case "violin":
        this.playNote(67, {
          type: "sawtooth",
          gain: 0.5,
          dur: 1.4,
          attack: 0.28,
          harmonic: false,
        });
        break;
      case "voice":
        this.playNote(69, {
          type: "sine",
          gain: 0.6,
          dur: 1.3,
          harmonic: false,
          vibrato: true,
        });
        break;
      case "guitar":
        this.playNote(64, { type: "triangle", gain: 0.8, dur: 0.5 });
        break;
      case "dance":
        this.playNoise({ dur: 0.12, freq: 260, gain: 0.5 });
        window.setTimeout(
          () => this.playNoise({ dur: 0.12, freq: 260, gain: 0.45 }),
          220,
        );
        break;
    }
  }

  dispose(): void {
    this.voices = [];
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}

// Sound effects made with WebAudio (nothing to download): soft pops, sparkly chimes
// and a short fanfare, all through a little reverb so they feel bright and alive.

let ctx: AudioContext | null = null;
let bus: GainNode | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}

function ac(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      bus = ctx.createGain();
      bus.gain.value = 0.9;
      // gentle reverb from a decaying noise burst
      const len = Math.floor(ctx.sampleRate * 0.9);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
      const conv = ctx.createConvolver();
      conv.buffer = buf;
      const wet = ctx.createGain();
      wet.gain.value = 0.28;
      bus.connect(ctx.destination);
      bus.connect(conv).connect(wet).connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.16, glideTo?: number) {
  const c = ac();
  if (!c || !bus) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const t = c.currentTime + start;
  o.frequency.setValueAtTime(freq, t);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function bell(freq: number, start: number, vol = 0.13) {
  tone(freq, start, 0.5, 'sine', vol);
  tone(freq * 2.01, start, 0.3, 'sine', vol * 0.35);
  tone(freq * 3.02, start, 0.18, 'triangle', vol * 0.15);
}

function noise(start: number, dur: number, vol = 0.06, hp = 4000) {
  const c = ac();
  if (!c || !bus) return;
  const len = Math.floor(c.sampleRate * dur);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource();
  s.buffer = b;
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = hp;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(bus);
  s.start(c.currentTime + start);
}

export const sfx = {
  tap() {
    tone(520, 0, 0.07, 'sine', 0.1, 760);
  },
  pop() {
    tone(380, 0, 0.1, 'sine', 0.12, 900);
  },
  correct() {
    bell(784, 0);
    bell(1047, 0.08);
    bell(1319, 0.17, 0.1);
    noise(0.1, 0.18, 0.03, 6000);
  },
  // Gentle and never harsh: a soft low bloop
  wrong() {
    tone(300, 0, 0.22, 'sine', 0.12, 220);
  },
  whoosh() {
    noise(0, 0.28, 0.05, 1800);
  },
  star(i = 0) {
    bell(880 * Math.pow(1.122, i * 2), 0, 0.12);
  },
  celebrate() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => bell(f, i * 0.085, 0.11));
    noise(0.45, 0.5, 0.05, 5000);
  },
  levelUp() {
    [392, 523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => bell(f, i * 0.1, 0.12));
    tone(130, 0, 0.9, 'triangle', 0.1);
    noise(0.7, 0.8, 0.06, 5000);
  },
};

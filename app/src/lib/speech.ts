// Text-to-speech, speech recognition and microphone recording.
// Everything is guarded: phones without voices or mics still work.

type Lang = 'en' | 'hi';

let voices: SpeechSynthesisVoice[] = [];
let rateFactor = 1;

const synth: SpeechSynthesis | null =
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

function loadVoices() {
  try {
    voices = synth ? synth.getVoices() : [];
  } catch {
    voices = [];
  }
}
if (synth) {
  loadVoices();
  try {
    synth.addEventListener('voiceschanged', loadVoices);
  } catch {
    /* older browsers */
  }
}

export function setSlowSpeech(slow: boolean) {
  rateFactor = slow ? 0.8 : 1;
}

function norm(l: string) {
  return l.replace('_', '-').toLowerCase();
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  if (!voices.length) loadVoices();
  const prefs = lang === 'en' ? ['en-in', 'en-gb', 'en-us', 'en-au'] : ['hi-in'];
  for (const p of prefs) {
    const local = voices.find((v) => norm(v.lang) === p && v.localService);
    if (local) return local;
    const any = voices.find((v) => norm(v.lang) === p);
    if (any) return any;
  }
  return voices.find((v) => norm(v.lang).startsWith(lang));
}

export function hasVoice(lang: Lang) {
  return !!synth && !!pickVoice(lang);
}

let speakToken = 0;

export function stopSpeaking() {
  speakToken++;
  try {
    synth?.cancel();
  } catch {
    /* ignore */
  }
}

/** Speak one phrase. Resolves when finished (or after a safety timeout). */
export function speak(text: string, lang: Lang = 'en', opts: { rate?: number } = {}): Promise<void> {
  const token = ++speakToken;
  return new Promise((resolve) => {
    if (!synth || !text) return resolve();
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.lang = v?.lang ?? (lang === 'en' ? 'en-IN' : 'hi-IN');
      u.rate = (opts.rate ?? (lang === 'en' ? 0.85 : 0.95)) * rateFactor;
      u.pitch = 1.05;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(finish, 1500 + text.length * 140);
      u.onend = finish;
      u.onerror = finish;
      if (token !== speakToken) return resolve();
      synth.speak(u);
    } catch {
      resolve();
    }
  });
}

/** Speak a sequence: [[text, lang], ...]. Stops if another speak starts. */
export async function speakSeq(parts: Array<[string, Lang] | [string, Lang, number]>) {
  for (const [text, lang, rate] of parts) {
    const before = speakToken;
    await speak(text, lang, rate ? { rate } : {});
    // speak() bumps the token once; any further bump means something else interrupted
    if (speakToken !== before + 1) return;
    await new Promise((r) => setTimeout(r, 180));
    if (speakToken !== before + 1) return;
  }
}

// ---------- Speech recognition ----------

type RecCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function recCtor(): RecCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canRecognize() {
  return typeof window !== 'undefined' && !!recCtor() && navigator.onLine !== false;
}

/** Listen once. Resolves with transcript alternatives, or null if nothing/unsupported. */
export function recognizeOnce(timeoutMs = 7000): { promise: Promise<string[] | null>; cancel: () => void } {
  const Ctor = recCtor();
  if (!Ctor) return { promise: Promise.resolve(null), cancel: () => {} };
  let rec: InstanceType<RecCtor> | null = null;
  let settle: (v: string[] | null) => void = () => {};
  const promise = new Promise<string[] | null>((resolve) => {
    let done = false;
    settle = (v) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        rec?.abort();
      } catch {
        /* ignore */
      }
      resolve(v);
    };
    const timer = setTimeout(() => settle(null), timeoutMs);
    try {
      stopSpeaking();
      rec = new Ctor();
      rec.lang = 'en-IN';
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      rec.continuous = false;
      rec.onresult = (e) => {
        const out: string[] = [];
        const r = e.results[0];
        if (r) for (let i = 0; i < r.length; i++) out.push(r[i].transcript);
        settle(out.length ? out : null);
      };
      rec.onerror = () => settle(null);
      rec.onend = () => settle(null);
      rec.start();
    } catch {
      settle(null);
    }
  });
  return { promise, cancel: () => settle(null) };
}

function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9' ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function lev(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

/** 0..1 how close what was heard is to the target. Lenient on purpose. */
export function speechMatch(target: string, heard: string[]): number {
  const t = words(target);
  if (!t.length) return 0;
  let best = 0;
  for (const h of heard) {
    const hw = words(h);
    let hit = 0;
    for (const w of t) {
      if (hw.some((x) => x === w || (w.length > 3 && lev(x, w) <= 1))) hit++;
    }
    best = Math.max(best, hit / t.length);
  }
  return best;
}

// ---------- Recording (fallback when recognition is not available) ----------

export function canRecord() {
  return typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && 'MediaRecorder' in window;
}

export async function recordClip(ms = 3500): Promise<string | null> {
  if (!canRecord()) return null;
  try {
    stopSpeaking();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<void>((r) => (rec.onstop = () => r()));
    rec.start();
    await new Promise((r) => setTimeout(r, ms));
    rec.stop();
    await done;
    stream.getTracks().forEach((t) => t.stop());
    return URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
  } catch {
    return null;
  }
}

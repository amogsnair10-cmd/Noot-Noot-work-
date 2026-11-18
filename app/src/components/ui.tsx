import { useEffect, useRef, useState } from 'react';
import { speak, speakSeq, stopSpeaking } from '../lib/speech';
import type { Audio } from '../lib/engine';

export type Mood = 'idle' | 'happy' | 'think' | 'talk' | 'sad';

/** Mitra, the friendly guide bird. */
export function Mascot({ size = 72, mood = 'idle' }: { size?: number; mood?: Mood }) {
  return (
    <svg className={`mascot ${mood}`} width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(0,0,0,.08)" />
      <path d="M50 18 Q56 4 62 16 Q68 6 70 20" fill="#FF7A1A" />
      <circle cx="60" cy="62" r="44" fill="#12A39A" />
      <ellipse cx="60" cy="78" rx="28" ry="24" fill="#BFF0EA" />
      <path d="M17 62 Q8 80 24 88 Q22 74 26 64Z" fill="#0B7D76" />
      <path d="M103 62 Q112 80 96 88 Q98 74 94 64Z" fill="#0B7D76" />
      <g className="eyes">
        <circle cx="44" cy="50" r="13" fill="#fff" />
        <circle cx="76" cy="50" r="13" fill="#fff" />
        {mood === 'happy' ? (
          <>
            <path d="M37 52 Q44 43 51 52" stroke="#1E1B3A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M69 52 Q76 43 83 52" stroke="#1E1B3A" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={mood === 'think' ? 48 : 46} cy={mood === 'think' ? 46 : 52} r="6" fill="#1E1B3A" />
            <circle cx={mood === 'think' ? 80 : 78} cy={mood === 'think' ? 46 : 52} r="6" fill="#1E1B3A" />
            <circle cx={mood === 'think' ? 50 : 48} cy={mood === 'think' ? 44 : 50} r="2" fill="#fff" />
            <circle cx={mood === 'think' ? 82 : 80} cy={mood === 'think' ? 44 : 50} r="2" fill="#fff" />
          </>
        )}
      </g>
      <path className="beak" d="M52 62 L68 62 L60 73 Z" fill="#FFB020" />
      {mood === 'happy' && (
        <>
          <circle cx="32" cy="66" r="5" fill="#FF8FA3" opacity=".6" />
          <circle cx="88" cy="66" r="5" fill="#FF8FA3" opacity=".6" />
        </>
      )}
    </svg>
  );
}

/** Big round speaker button. Plays the given audio sequence. */
export function Speaker({ audio, size = 'lg', autoPlay = false, delay = 0 }: { audio: Audio; size?: 'lg' | 'sm'; autoPlay?: boolean; delay?: number }) {
  const [playing, setPlaying] = useState(false);
  const key = audio.map((a) => a.join(':')).join('|');
  const play = async () => {
    setPlaying(true);
    await speakSeq(audio);
    setPlaying(false);
  };
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(play, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, autoPlay]);
  return (
    <button className={`speaker ${size === 'sm' ? 'sm' : ''} ${playing ? 'playing' : ''}`} onClick={play} aria-label="Listen">
      🔊
    </button>
  );
}

/** Instruction line: mascot + Hindi/English text. Tapping replays it. */
export function Instruction({ hi, en, showHi = true, onReplay }: { hi: string; en: string; showHi?: boolean; onReplay?: () => void }) {
  return (
    <button className="ins" onClick={onReplay} aria-label={en}>
      <Mascot size={58} mood="talk" />
      <div className="bubble" style={{ textAlign: 'left' }}>
        {showHi && <div className="t-hi hi">{hi}</div>}
        <div className={showHi ? 't-en' : 't-hi'}>{en}</div>
      </div>
    </button>
  );
}

export function ProgressRing({ value, size = 64, stroke = 8, color = 'var(--primary)', children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#f0e7d8" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: 'stroke-dashoffset .6s' }} />
      </svg>
      <div className="in">{children}</div>
    </div>
  );
}

/** Lightweight confetti burst. */
export function Confetti({ run }: { run: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!run || !ref.current) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = (cv.width = window.innerWidth);
    const H = (cv.height = window.innerHeight);
    const colors = ['#FF7A1A', '#12A39A', '#6C4CF1', '#E8457C', '#FFC93C', '#2F80ED'];
    const ps = Array.from({ length: 120 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 14 - 4,
      r: Math.random() * 6 + 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.3,
    }));
    let raf = 0;
    let frames = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      }
      if (++frames < 170) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} className="confetti" />;
}

export function Stars({ n, of = 3, size = 34 }: { n: number; of?: number; size?: number }) {
  return (
    <div style={{ fontSize: size, letterSpacing: 4 }}>
      {Array.from({ length: of }, (_, i) => (
        <span key={i} style={{ filter: i < n ? 'none' : 'grayscale(1) opacity(.3)', display: 'inline-block', animation: i < n ? `pop .4s ${0.2 + i * 0.2}s both` : undefined }}>
          ⭐
        </span>
      ))}
    </div>
  );
}

export function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** Speak a Hindi/English line when a screen opens (once). */
export function useSayOnce(parts: Audio, enabled = true) {
  const done = useRef(false);
  useEffect(() => {
    if (!enabled || done.current) return;
    done.current = true;
    const t = setTimeout(() => void speakSeq(parts), 300);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

export const say = speak;

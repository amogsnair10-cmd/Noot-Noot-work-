import { useEffect, useRef, useState } from 'react';
import type { Audio } from '../lib/engine';
import { replayLast, setReplay, speakSeq, stopSpeaking } from '../lib/speech';
import type { Part } from '../lib/speech';
import { activeProfile, hindiShown, useAppState } from '../lib/store';
import { Icon } from './Icon';
import { Mascot } from './Mascot';
import type { Mood } from './Mascot';

export { Mascot };
export type { Mood };

/** Slow aurora, dust and grain behind everything. */
export function Sky() {
  return (
    <div className="sky" aria-hidden>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="dust" />
      <div className="grain" />
    </div>
  );
}

/** Is Hindi translation visible right now? */
export function useHindi(): boolean {
  const app = useAppState();
  const p = activeProfile(app);
  return hindiShown(app.settings, p?.level ?? 1);
}

/** English first; Hindi only as the small translation line. */
export function Tr({ en, hi, line = false, force = false }: { en: React.ReactNode; hi?: string; line?: boolean; force?: boolean }) {
  const on = useHindi();
  return (
    <span className={`tr ${line ? 'line' : ''}`}>
      <span className="en">{en}</span>
      {hi && (on || force) && <span className="hi-tr hi">{hi}</span>}
    </span>
  );
}

/** Spoken lines: English, then the Hindi translation when it is on. */
export function say2(en: string, hi: string | undefined, hindi: boolean): Audio {
  return hindi && hi ? [[en, 'en'], [hi, 'hi']] : [[en, 'en']];
}

/** Big round "listen" button. */
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
    <button className={`speaker ${size === 'sm' ? 'sm' : ''} ${playing ? 'playing' : ''}`} onClick={play} aria-label="Listen again">
      <Icon name="speaker" size={size === 'sm' ? 26 : 38} stroke={2.6} />
    </button>
  );
}

/** Replay whatever this page just said. Available on every page. */
export function ReplayButton({ top = false, corner = false, onReplay }: { top?: boolean; corner?: boolean; onReplay?: () => void }) {
  const [on, setOn] = useState(false);
  return (
    <button
      className={`replay ${top ? 'top' : ''} ${corner ? 'corner' : ''} ${on ? 'playing' : ''}`}
      aria-label="Replay audio"
      title="Replay audio"
      onClick={async () => {
        setOn(true);
        if (onReplay) onReplay();
        else replayLast();
        setTimeout(() => setOn(false), 1800);
      }}
    >
      <Icon name="speaker" size={top ? 24 : 28} stroke={2.6} />
    </button>
  );
}

/** Pip + speech bubble with the instruction. Tapping replays it. */
export function Instruction({ en, hi, onReplay }: { en: string; hi: string; onReplay?: () => void }) {
  return (
    <button className="ins" onClick={onReplay} aria-label={`${en}. Tap to hear again`}>
      <Mascot size={58} mood="talk" />
      <span className="bubble">
        <Tr en={en} hi={hi} />
      </span>
    </button>
  );
}

export function ProgressRing({ value, size = 64, stroke = 8, color = 'var(--gold)', children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="ringbox" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.12)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          style={{ transition: 'stroke-dashoffset .8s', filter: `drop-shadow(0 0 6px ${color})` }}
        />
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
    const colors = ['#8B6CFF', '#22D3EE', '#FF6FA8', '#FFC857', '#34E5A0', '#FFFFFF'];
    const ps = Array.from({ length: 130 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H * 0.34,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 15 - 4,
      r: Math.random() * 6 + 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.3,
      s: Math.random() < 0.3,
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
        if (p.s) {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      }
      if (++frames < 180) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} className="confetti" />;
}

export function Stars({ n, of = 3, size = 44 }: { n: number; of?: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: of }, (_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            color: i < n ? 'var(--gold)' : 'rgba(255,255,255,.18)',
            filter: i < n ? 'drop-shadow(0 0 14px rgba(255,200,87,.8))' : undefined,
            animation: i < n ? `pop .5s ${0.25 + i * 0.25}s both` : undefined,
            transform: i === 1 ? 'translateY(-8px)' : undefined,
          }}
        >
          <Icon name="star" size={size} stroke={1.4} />
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

/** Speak a line when a screen opens (once), and remember it so Replay works. */
export function useSayOnce(parts: Part[], enabled = true) {
  const done = useRef(false);
  useEffect(() => {
    if (!enabled) return;
    setReplay(parts);
    if (done.current) return;
    done.current = true;
    const t = setTimeout(() => void speakSeq(parts), 350);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

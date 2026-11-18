import { useEffect, useRef, useState } from 'react';
import type { Step } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { speak, speakSeq } from '../lib/speech';
import type { ActProps } from './Choice';

type TraceStep = Extract<Step, { kind: 'trace' }>;

const SIZE = 300;
const FONT = (px: number) => `800 ${px}px 'Baloo 2', sans-serif`;

/** Trace a letter with a finger. Checks how much of the letter was covered. */
export function Trace({ step, intro, showHi, onDone }: ActProps<TraceStep>) {
  const guide = useRef<HTMLCanvasElement>(null);
  const ink = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState('');
  const [hasInk, setHasInk] = useState(false);
  const [done, setDone] = useState(false);
  const [upper, setUpper] = useState(false);
  const ch = upper ? step.ch.toUpperCase() : step.ch;

  useEffect(() => {
    setTries(0);
    setDone(false);
    setUpper(false);
    void speakSeq([...intro, [step.ch.toUpperCase(), 'en']]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const g = guide.current?.getContext('2d');
      if (!g) return;
      const dpr = 2;
      guide.current!.width = SIZE * dpr;
      guide.current!.height = SIZE * dpr;
      g.scale(dpr, dpr);
      g.clearRect(0, 0, SIZE, SIZE);
      // baseline guides
      g.strokeStyle = '#efe5d4';
      g.lineWidth = 2;
      g.setLineDash([8, 8]);
      [70, 150, 230].forEach((y) => {
        g.beginPath();
        g.moveTo(16, y);
        g.lineTo(SIZE - 16, y);
        g.stroke();
      });
      g.setLineDash([]);
      g.font = FONT(230);
      g.textAlign = 'center';
      g.textBaseline = 'alphabetic';
      g.fillStyle = '#ece4ff';
      g.fillText(ch, SIZE / 2, 232);
      g.strokeStyle = '#b9a8ff';
      g.lineWidth = 3;
      g.setLineDash([10, 9]);
      g.strokeText(ch, SIZE / 2, 232);
      clearInk();
    };
    if (document.fonts?.load) document.fonts.load(FONT(230)).then(draw, draw);
    else draw();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch, step.id]);

  const clearInk = () => {
    const c = ink.current;
    if (!c) return;
    c.width = SIZE * 2;
    c.height = SIZE * 2;
    setHasInk(false);
    setMsg('');
  };

  const pos = (e: React.PointerEvent) => {
    const r = ink.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };

  const line = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const c = ink.current!.getContext('2d')!;
    c.setTransform(2, 0, 0, 2, 0, 0);
    c.strokeStyle = '#FF7A1A';
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = 24;
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
  };

  const down = (e: React.PointerEvent) => {
    if (done) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const p = pos(e);
    last.current = p;
    line(p, { x: p.x + 0.1, y: p.y + 0.1 });
    setHasInk(true);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    line(last.current, p);
    last.current = p;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const evaluate = () => {
    // Build a mask of the letter shape and compare with the ink.
    const m = document.createElement('canvas');
    m.width = SIZE;
    m.height = SIZE;
    const mc = m.getContext('2d')!;
    mc.font = FONT(230);
    mc.textAlign = 'center';
    mc.fillStyle = '#000';
    mc.fillText(ch, SIZE / 2, 232);
    const tol = document.createElement('canvas');
    tol.width = SIZE;
    tol.height = SIZE;
    const tc = tol.getContext('2d')!;
    tc.font = FONT(230);
    tc.textAlign = 'center';
    tc.fillStyle = '#000';
    tc.strokeStyle = '#000';
    tc.lineWidth = 34;
    tc.lineJoin = 'round';
    tc.fillText(ch, SIZE / 2, 232);
    tc.strokeText(ch, SIZE / 2, 232);
    const ic = document.createElement('canvas');
    ic.width = SIZE;
    ic.height = SIZE;
    const icx = ic.getContext('2d')!;
    icx.drawImage(ink.current!, 0, 0, SIZE, SIZE);
    const md = mc.getImageData(0, 0, SIZE, SIZE).data;
    const td = tc.getImageData(0, 0, SIZE, SIZE).data;
    const id = icx.getImageData(0, 0, SIZE, SIZE).data;
    let inMask = 0;
    let covered = 0;
    let inkPts = 0;
    let inkInside = 0;
    for (let y = 0; y < SIZE; y += 4)
      for (let x = 0; x < SIZE; x += 4) {
        const k = (y * SIZE + x) * 4 + 3;
        const isMask = md[k] > 100;
        const isInk = id[k] > 60;
        if (isMask) {
          inMask++;
          if (isInk) covered++;
        }
        if (isInk) {
          inkPts++;
          if (td[k] > 60) inkInside++;
        }
      }
    const coverage = inMask ? covered / inMask : 0;
    const precision = inkPts ? inkInside / inkPts : 0;
    return coverage >= 0.5 && precision >= 0.65;
  };

  const check = () => {
    const ok = evaluate();
    if (ok) {
      sfx.correct();
      if (!upper) {
        // Then the capital letter
        setMsg('');
        void speak(showHi ? 'बहुत अच्छा! अब बड़ा अक्षर' : 'Great! Now the capital letter', showHi ? 'hi' : 'en');
        setUpper(true);
        return;
      }
      setDone(true);
      onDone({ correct: tries === 0, assisted: tries > 0 });
    } else {
      sfx.wrong();
      const t = tries + 1;
      setTries(t);
      if (t >= 3) {
        setDone(true);
        onDone({ correct: false, assisted: false });
        return;
      }
      setMsg(showHi ? 'लाइन के ऊपर चलो। फिर से!' : 'Stay on the line. Try again!');
      void speak(showHi ? 'लाइन के ऊपर चलो, फिर से कोशिश करो' : 'Stay on the line and try again', showHi ? 'hi' : 'en');
      setTimeout(clearInk, 700);
    }
  };

  return (
    <>
      <div className="trace-wrap">
        <canvas ref={guide} />
        <canvas ref={ink} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} style={{ touchAction: 'none' }} />
      </div>
      {msg && <div className="hi" style={{ textAlign: 'center', fontWeight: 700, color: '#a35f00' }}>{msg}</div>}
      <div className="row">
        <button className="btn ghost" onClick={clearInk} disabled={done} aria-label="Clear">
          🧽
        </button>
        <button className="btn teal block" onClick={check} disabled={!hasInk || done}>
          ✓ {showHi ? 'हो गया' : 'Done'}
        </button>
      </div>
    </>
  );
}

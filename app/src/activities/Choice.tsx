import { useEffect, useState } from 'react';
import type { Audio, Step } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { speak, speakSeq } from '../lib/speech';
import { Speaker } from '../components/ui';

export interface ActProps<S> {
  step: S;
  intro: Audio; // spoken instruction before the prompt
  test: boolean;
  showHi: boolean;
  onDone: (r: { correct: boolean; assisted: boolean; scored?: boolean }) => void;
}

type ChoiceStep = Extract<Step, { kind: 'choice' }>;

export function Choice({ step, intro, test, showHi, onDone }: ActProps<ChoiceStep>) {
  const [out, setOut] = useState<number[]>([]);
  const [solved, setSolved] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const p = step.prompt;
  const audio = p.audio ?? [];

  useEffect(() => {
    setOut([]);
    setSolved(null);
    setPicked(null);
    const t = setTimeout(() => void speakSeq([...intro, ...audio]), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  const glow = !test && solved === null && out.length >= Math.min(2, step.options.length - 1);

  const tap = (i: number) => {
    if (solved !== null || picked !== null || out.includes(i)) return;
    const o = step.options[i];
    if (test) {
      sfx.tap();
      setPicked(i);
      setTimeout(() => onDone({ correct: i === step.answer, assisted: false }), 350);
      return;
    }
    if (i === step.answer) {
      sfx.correct();
      setSolved(i);
      if (o.say) void speak(o.say);
      onDone({ correct: out.length === 0, assisted: out.length > 0 });
    } else {
      sfx.wrong();
      const nx = [...out, i];
      setOut(nx);
      const again: Audio = [['फिर से कोशिश करो', 'hi']];
      void speakSeq(showHi ? [...again, ...audio] : [['Try again', 'en'], ...audio]);
    }
  };

  const optCls = step.options.some((o) => o.style === 'answer') ? 'options list' : step.options.length === 3 && step.options[0].style === 'emoji' ? 'options' : 'options';

  return (
    <>
      <div className="prompt">
        {p.emoji && <div className="big-emoji">{p.emoji}</div>}
        {p.text && p.big === 'letter' && <div className="big-letter">{p.text}</div>}
        {p.text && p.big === 'word' && <div className="big-word">{p.text}</div>}
        {p.text && p.big === 'sentence' && <div className="big-sentence">{p.text}</div>}
        {p.hi && showHi && <div className="hi muted" style={{ fontSize: 18 }}>{p.hi}</div>}
        {audio.length > 0 && <Speaker audio={audio} size={p.emoji || p.text ? 'sm' : 'lg'} />}
      </div>
      <div className={optCls} style={step.options.length === 3 && step.options[0].style !== 'answer' ? { gridTemplateColumns: '1fr 1fr 1fr' } : undefined}>
        {step.options.map((o, i) => {
          const cls = ['opt', o.style === 'answer' ? 'answer' : '', solved === i ? 'right' : '', out.includes(i) ? 'out' : '', glow && i === step.answer ? 'glow' : '', picked === i ? 'picked' : ''].join(' ');
          return (
            <button key={i} className={cls} onClick={() => tap(i)} disabled={out.includes(i)} aria-label={o.label ?? o.emoji}>
              {o.emoji && <span className="e">{o.emoji}</span>}
              {o.label && o.style === 'letter' && <span className="l">{o.label}</span>}
              {o.label && o.style === 'text' && <span className="w">{o.label}</span>}
              {o.label && o.style === 'hindi' && <span className="h hi">{o.label}</span>}
              {o.label && o.style === 'answer' && <span>{o.label}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

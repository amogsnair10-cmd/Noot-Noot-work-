import { useEffect, useRef, useState } from 'react';
import { Choice } from '../activities/Choice';
import { Say, Write } from '../activities/Speak';
import { ReadAlong, TeachBlend, TeachDialogue, TeachLetter, TeachSentence, TeachSight, TeachWord } from '../activities/Teach';
import { Build, Order } from '../activities/Tiles';
import { Trace } from '../activities/Trace';
import { Instruction, Mascot, Sheet } from '../components/ui';
import type { Audio, Phase, Step, StepResult } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { speak, speakSeq, stopSpeaking } from '../lib/speech';

export interface Session {
  id: string;
  kind: 'lesson' | 'practice' | 'checkpoint';
  lessonId?: string;
  title: string;
  level: number;
  easy: boolean;
  steps: Step[];
  index: number;
  results: StepResult[];
  seconds: number;
  writings: { prompt: string; text: string }[];
}

const PHASES: Record<Phase, { icon: string; en: string; hi: string }> = {
  warmup: { icon: '🔁', en: 'Warm-up', hi: 'याद करो' },
  learn: { icon: '👀', en: 'Learn', hi: 'सीखो' },
  practice: { icon: '✋', en: 'Practise', hi: 'अभ्यास' },
  apply: { icon: '🧩', en: 'Use it', hi: 'इस्तेमाल करो' },
  check: { icon: '🎯', en: 'Check', hi: 'जाँच' },
};

const PRAISE: Array<[string, string]> = [
  ['Great job!', 'बहुत अच्छा!'],
  ['Correct!', 'सही जवाब!'],
  ['You did it!', 'तुमने कर दिखाया!'],
  ['Super!', 'शाबाश!'],
  ['Well done!', 'बढ़िया!'],
];

type Fb = { tone: 'good' | 'try'; en: string; hi: string; sub?: string; subHi?: string };

export function Player({
  session,
  test = false,
  onProgress,
  onFinish,
  onQuit,
  header,
}: {
  session: Session;
  test?: boolean;
  onProgress?: (s: Session) => void;
  onFinish: (s: Session) => void;
  onQuit: (s: Session) => void;
  header?: React.ReactNode;
}) {
  const [s, setS] = useState<Session>(session);
  const [fb, setFb] = useState<Fb | null>(null);
  const [quit, setQuit] = useState(false);
  const spoken = useRef(new Set<string>());
  const secRef = useRef(session.seconds);
  const step = s.steps[s.index];
  const showHi = test || s.level <= 2 || s.easy;

  // Count active seconds
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') secRef.current += 1;
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  // Hand the session upward when the step changes (for resume)
  useEffect(() => {
    onProgress?.({ ...s, seconds: secRef.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.index]);

  if (!step) return null;
  if (import.meta.env.DEV) (window as unknown as { __step?: Step }).__step = step;

  const intro: Audio = spoken.current.has(step.ins.key) ? [] : showHi ? [[step.ins.hi, 'hi']] : [[step.ins.en, 'en']];
  spoken.current.add(step.ins.key);

  const advance = (results: StepResult[], writings = s.writings) => {
    setFb(null);
    const next = { ...s, index: s.index + 1, results, writings, seconds: secRef.current };
    if (next.index >= s.steps.length) {
      stopSpeaking();
      onFinish(next);
    } else setS(next);
  };

  const onDone = (r: { correct: boolean; assisted: boolean; scored?: boolean }, writing?: string) => {
    const scored = r.scored !== false && !step.kind.startsWith('teach') && step.kind !== 'readAlong' && step.kind !== 'write';
    const res: StepResult = { stepId: step.id, phase: step.phase, skill: step.skill, item: step.item, correct: r.correct, assisted: r.assisted, scored };
    const results = [...s.results, res];
    const writings = writing ? [...s.writings, { prompt: step.kind === 'write' ? step.promptEn : '', text: writing }] : s.writings;
    if (!scored || test) {
      advance(results, writings);
      return;
    }
    setS({ ...s, results, writings });
    if (r.correct && !r.assisted) {
      const [en, hi] = PRAISE[Math.floor(Math.random() * PRAISE.length)];
      setFb({ tone: 'good', en, hi });
      setTimeout(() => void speak(showHi ? hi : en, showHi ? 'hi' : 'en'), 500);
    } else if (r.assisted) {
      setFb({ tone: 'good', en: 'You got it!', hi: 'मिल गया!', sub: 'Next time, try to get it on the first go.', subHi: 'अगली बार पहली बार में करने की कोशिश करना।' });
    } else {
      setFb({ tone: 'try', en: 'Good try!', hi: 'अच्छी कोशिश!', sub: "We'll practise this again soon.", subHi: 'हम इसे जल्दी फिर से दोहराएँगे।' });
    }
  };

  const props = { intro, test, showHi, onDone };
  const ph = PHASES[step.phase];
  const pct = (s.index / s.steps.length) * 100;

  const replayIns = () => void speakSeq(showHi ? [[step.ins.hi, 'hi']] : [[step.ins.en, 'en']]);

  return (
    <div className="player">
      <div className="player-top">
        <button className="icon-btn" onClick={() => setQuit(true)} aria-label="Close">
          ✕
        </button>
        <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)}>
          <div style={{ width: `${Math.max(4, pct)}%` }} />
        </div>
        <span className="chip" style={{ fontSize: 14 }}>
          {s.index + 1}/{s.steps.length}
        </span>
      </div>
      {header ?? (
        !test && (
          <div className="phase">
            <span>{ph.icon}</span>
            <span className="hi">{showHi ? ph.hi : ph.en}</span>
            {showHi && <span style={{ fontWeight: 600 }}>· {ph.en}</span>}
          </div>
        )
      )}
      <div className="stage" key={step.id}>
        {!step.kind.startsWith('teach') && step.kind !== 'readAlong' && <Instruction hi={step.ins.hi} en={step.ins.en} showHi={showHi} onReplay={replayIns} />}
        {step.kind === 'choice' && <Choice step={step} {...props} />}
        {step.kind === 'build' && <Build step={step} {...props} />}
        {step.kind === 'order' && <Order step={step} {...props} />}
        {step.kind === 'trace' && <Trace step={step} {...props} />}
        {step.kind === 'say' && <Say step={step} {...props} />}
        {step.kind === 'write' && <Write step={step} {...props} onWrite={(t) => onDone({ correct: true, assisted: false, scored: false }, t)} />}
        {step.kind === 'teachWord' && <TeachWord step={step} {...props} />}
        {step.kind === 'teachLetter' && <TeachLetter step={step} {...props} />}
        {step.kind === 'teachBlend' && <TeachBlend step={step} {...props} />}
        {step.kind === 'teachSight' && <TeachSight step={step} {...props} />}
        {step.kind === 'teachSentence' && <TeachSentence step={step} {...props} />}
        {step.kind === 'teachDialogue' && <TeachDialogue step={step} {...props} />}
        {step.kind === 'readAlong' && <ReadAlong step={step} {...props} onDone={test ? () => advance(s.results) : onDone} />}
      </div>

      {fb && (
        <div className={`feedback ${fb.tone}`}>
          <div className="msg">
            <Mascot size={54} mood={fb.tone === 'good' ? 'happy' : 'think'} />
            <div>
              <div className="hi">{showHi ? fb.hi : fb.en}</div>
              {showHi && <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.8 }}>{fb.en}</div>}
            </div>
          </div>
          {fb.sub && <div className="sub hi">{showHi ? fb.subHi : fb.sub}</div>}
          <button
            className={`btn block ${fb.tone === 'good' ? 'good' : ''}`}
            onClick={() => {
              sfx.tap();
              stopSpeaking();
              advance(s.results);
            }}
            autoFocus
          >
            {showHi ? 'आगे बढ़ो' : 'Continue'} ▶
          </button>
        </div>
      )}

      {quit && (
        <Sheet onClose={() => setQuit(false)}>
          <div className="row">
            <Mascot size={64} mood="think" />
            <div>
              <h3 className="hi">{showHi ? 'क्या अभी रुकना है?' : 'Stop for now?'}</h3>
              <div className="muted hi">{test ? (showHi ? 'टेस्ट बाद में फिर से शुरू होगा।' : 'The test will start again later.') : showHi ? 'चिंता मत करो, तुम यहीं से फिर शुरू कर सकते हो।' : "Don't worry — you can continue from here later."}</div>
            </div>
          </div>
          <button className="btn block teal" onClick={() => setQuit(false)}>
            {showHi ? 'सीखते रहो' : 'Keep learning'} 💪
          </button>
          <button
            className="btn block ghost"
            onClick={() => {
              stopSpeaking();
              onQuit({ ...s, seconds: secRef.current });
            }}
          >
            {showHi ? 'रुको' : 'Stop'}
          </button>
        </Sheet>
      )}
    </div>
  );
}

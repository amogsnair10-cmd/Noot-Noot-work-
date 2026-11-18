import { useEffect, useRef, useState } from 'react';
import { Choice } from '../activities/Choice';
import { Say, Write } from '../activities/Speak';
import { ReadAlong, TeachBlend, TeachDialogue, TeachLetter, TeachSentence, TeachSight, TeachWord } from '../activities/Teach';
import { Build, Order } from '../activities/Tiles';
import { Trace } from '../activities/Trace';
import { Icon } from '../components/Icon';
import { Instruction, Mascot, ReplayButton, Sheet, Tr, say2 } from '../components/ui';
import type { Audio, Phase, Step, StepResult } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { getLastParts, speakSeq, stopSpeaking } from '../lib/speech';
import { hindiShown, useAppState } from '../lib/store';

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

const PHASES: Record<Phase, { en: string; hi: string }> = {
  warmup: { en: 'Warm-up', hi: 'याद करो' },
  learn: { en: 'Learn', hi: 'सीखो' },
  practice: { en: 'Practise', hi: 'अभ्यास' },
  apply: { en: 'Use it', hi: 'इस्तेमाल करो' },
  check: { en: 'Check', hi: 'जाँच' },
};

const PRAISE: Array<[string, string]> = [
  ['Great job!', 'बहुत अच्छा!'],
  ['Correct!', 'सही जवाब!'],
  ['You did it!', 'तुमने कर दिखाया!'],
  ['Fantastic!', 'शानदार!'],
  ['Well done!', 'बढ़िया!'],
  ["You're a star!", 'तुम तो सितारे हो!'],
  ['Wow, yes!', 'वाह, सही!'],
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
  const app = useAppState();
  const [s, setS] = useState<Session>(session);
  const [fb, setFb] = useState<Fb | null>(null);
  const [quit, setQuit] = useState(false);
  const spoken = useRef(new Set<string>());
  const secRef = useRef(session.seconds);
  const step = s.steps[s.index];
  // Hindi is a translation only. In tests it follows the setting too (auto = on for beginners).
  const hindi = s.easy || hindiShown(app.settings, test ? 1 : s.level);

  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') secRef.current += 1;
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    onProgress?.({ ...s, seconds: secRef.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.index]);

  if (!step) return null;
  if (import.meta.env.DEV) (window as unknown as { __step?: Step }).__step = step;

  const insAudio: Audio = say2(step.ins.en, step.ins.hi, hindi);
  const intro: Audio = spoken.current.has(step.ins.key) ? [] : insAudio;
  spoken.current.add(step.ins.key);

  const replay = () => {
    const content = getLastParts().filter(([t]) => !insAudio.some(([x]) => x === t));
    void speakSeq([...insAudio, ...content], { record: false });
  };

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
      setTimeout(() => void speakSeq(hindi ? [[en, 'en', 'cheer'], [hi, 'hi']] : [[en, 'en', 'cheer']], { record: false }), 450);
    } else if (r.assisted) {
      setFb({ tone: 'good', en: 'You got it!', hi: 'मिल गया!', sub: 'Next time, try to get it on the first go.', subHi: 'अगली बार पहली बार में करने की कोशिश करना।' });
    } else {
      setFb({ tone: 'try', en: 'Good try!', hi: 'अच्छी कोशिश!', sub: "We'll practise this again soon.", subHi: 'हम इसे जल्दी फिर से दोहराएँगे।' });
    }
  };

  const props = { intro, test, showHi: hindi, onDone };
  const ph = PHASES[step.phase];
  const pct = (s.index / s.steps.length) * 100;
  const isTeach = step.kind.startsWith('teach') || step.kind === 'readAlong';

  return (
    <div className="player">
      <div className="player-top">
        <button className="icon-btn" onClick={() => setQuit(true)} aria-label="Close">
          <Icon name="close" size={22} stroke={2.8} />
        </button>
        <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)}>
          <div style={{ width: `${Math.max(5, pct)}%` }} />
        </div>
        <span className="chip" style={{ fontSize: 14 }}>
          {s.index + 1}/{s.steps.length}
        </span>
        <ReplayButton top onReplay={replay} />
      </div>
      {header ?? (
        !test && (
          <div className="phase">
            <span className="dot" />
            <Tr en={ph.en} hi={ph.hi} line />
          </div>
        )
      )}
      <div className="stage" key={step.id}>
        {!isTeach && <Instruction en={step.ins.en} hi={step.ins.hi} onReplay={replay} />}
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
            <Mascot size={58} mood={fb.tone === 'good' ? 'happy' : 'think'} />
            <Tr en={fb.en} hi={fb.hi} force={hindi} />
          </div>
          {fb.sub && (
            <div className="sub">
              <Tr en={fb.sub} hi={fb.subHi} force={hindi} />
            </div>
          )}
          <button
            className={`btn block ${fb.tone === 'good' ? 'good' : 'gold'}`}
            onClick={() => {
              sfx.tap();
              stopSpeaking();
              advance(s.results);
            }}
            autoFocus
          >
            <Tr en="Continue" hi="आगे बढ़ो" /> <Icon name="next" size={24} stroke={3} />
          </button>
        </div>
      )}

      {quit && (
        <Sheet onClose={() => setQuit(false)}>
          <div className="row">
            <Mascot size={70} mood="think" />
            <div>
              <h3>
                <Tr en="Stop for now?" hi="क्या अभी रुकना है?" />
              </h3>
              <div className="muted small">{test ? 'The test will start again later.' : "Don't worry. You can continue from here later."}</div>
            </div>
          </div>
          <button className="btn block cyan" onClick={() => setQuit(false)}>
            <Tr en="Keep learning" hi="सीखते रहो" />
          </button>
          <button
            className="btn block ghost"
            onClick={() => {
              stopSpeaking();
              onQuit({ ...s, seconds: secRef.current });
            }}
          >
            <Tr en="Stop" hi="रुको" />
          </button>
        </Sheet>
      )}
    </div>
  );
}


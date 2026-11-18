import { useState } from 'react';
import { LEVELS } from '../content/curriculum';
import { SKILLS, SKILL_INFO } from '../content/types';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { Confetti, Mascot, Tr, useHindi, useSayOnce } from '../components/ui';
import type { StepResult } from '../lib/engine';
import { testPct } from '../lib/engine';
import { STAGES, scoreTest, stagePassed, stageSteps } from '../lib/placement';
import { sfx } from '../lib/sfx';
import type { Profile, TestResult } from '../lib/store';
import { Player } from './Player';

/** Runs the starting test (form A) or the final test (form B), part by part. */
export function TestFlow({ profile, form, onDone, onQuit }: { profile: Profile; form: 'A' | 'B'; onDone: (r: TestResult) => void; onQuit: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'run' | 'between' | 'result'>('intro');
  const [stage, setStage] = useState(0);
  const [all, setAll] = useState<StepResult[]>([]);
  const [passed, setPassed] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const isFinal = form === 'B';

  const finishStage = (res: StepResult[]) => {
    const merged = [...all, ...res];
    setAll(merged);
    const ok = stagePassed(res);
    const np = ok ? passed + 1 : passed;
    setPassed(np);
    if (ok && stage < STAGES.length - 1) {
      sfx.correct();
      setPhase('between');
    } else {
      const r = scoreTest(form, merged, np);
      setResult(r);
      setPhase('result');
      sfx.celebrate();
    }
  };

  if (phase === 'intro') return <Intro isFinal={isFinal} name={profile.name} onGo={() => setPhase('run')} onBack={onQuit} />;

  if (phase === 'run')
    return (
      <Player
        key={stage}
        test
        session={{ id: `test-${form}-${stage}`, kind: 'practice', title: 'Test', level: 1, easy: false, steps: stageSteps(form, stage), index: 0, results: [], seconds: 0, writings: [] }}
        header={
          <div className="phase">
            <Pic e={STAGES[stage].emoji} size={30} flat />
            <Tr en={`Part ${stage + 1} · ${STAGES[stage].en}`} hi={STAGES[stage].hi} line />
          </div>
        }
        onFinish={(s) => finishStage(s.results)}
        onQuit={onQuit}
      />
    );

  if (phase === 'between') return <Between next={stage + 2} stage={STAGES[stage + 1]} onGo={() => { setStage(stage + 1); setPhase('run'); }} />;

  return <Result r={result!} before={isFinal ? profile.placement : undefined} onDone={() => onDone(result!)} />;
}

function Between({ next, stage, onGo }: { next: number; stage: (typeof STAGES)[number]; onGo: () => void }) {
  const hindi = useHindi();
  useSayOnce(hindi ? [['Great work! Now the next part.', 'en', 'cheer'], ['बहुत बढ़िया! अब अगला भाग।', 'hi']] : [['Great work! Now the next part.', 'en', 'cheer']]);
  return (
    <div className="screen center" style={{ gap: 20 }}>
      <Mascot size={140} mood="happy" float />
      <h1>
        <Tr en="Great work!" hi="बहुत बढ़िया!" />
      </h1>
      <div className="glass row" style={{ width: '100%', padding: 16 }}>
        <Pic e={stage.emoji} size={66} />
        <div style={{ textAlign: 'left', fontSize: 22, fontWeight: 800 }}>
          <Tr en={`Part ${next}: ${stage.en}`} hi={stage.hi} />
        </div>
      </div>
      <button className="btn block" onClick={onGo}>
        <Tr en="Next" hi="आगे" /> <Icon name="next" size={24} stroke={3} />
      </button>
    </div>
  );
}

function Intro({ isFinal, name, onGo, onBack }: { isFinal: boolean; name: string; onGo: () => void; onBack: () => void }) {
  const hindi = useHindi();
  const en = isFinal ? 'Now show what you have learned. Just do your best!' : "Let's find out how much English you know. It is okay to make mistakes!";
  const hi = isFinal ? 'अब दिखाओ तुमने क्या सीखा। बस अपनी पूरी कोशिश करो!' : 'चलो देखते हैं तुम्हें कितनी अंग्रेज़ी आती है। गलती हो तो कोई बात नहीं!';
  useSayOnce(hindi ? [[en, 'en'], [hi, 'hi']] : [[en, 'en']]);
  return (
    <div className="screen center" style={{ gap: 20 }}>
      <Mascot size={150} mood="talk" float />
      <h1>
        <Tr en={isFinal ? 'Show what you know!' : 'Where should you start?'} hi={isFinal ? 'दिखाओ तुमने क्या सीखा!' : 'तुम कहाँ से शुरू करोगे?'} />
      </h1>
      <div className="muted">{isFinal ? `You can do it, ${name}.` : 'A short test finds the best place for you to begin.'}</div>
      <div className="glass col" style={{ width: '100%', textAlign: 'left', padding: 18, gap: 14 }}>
        {(
          [
            ['😌', 'Mistakes are okay', 'गलती हो तो कोई बात नहीं'],
            ['👂', 'Listen carefully', 'ध्यान से सुनो'],
            ['⏱️', 'About 5 to 10 minutes', 'लगभग 5 से 10 मिनट'],
          ] as const
        ).map(([e, en2, hi2]) => (
          <div key={en2} className="row" style={{ fontWeight: 700 }}>
            <Pic e={e} size={44} />
            <Tr en={en2} hi={hi2} />
          </div>
        ))}
      </div>
      <button className="btn block gold" onClick={onGo}>
        <Tr en="Start" hi="शुरू करो" /> <Icon name="next" size={24} stroke={3} />
      </button>
      <button className="btn ghost small" onClick={onBack}>
        Later
      </button>
    </div>
  );
}

function Result({ r, before, onDone }: { r: TestResult; before?: TestResult; onDone: () => void }) {
  const hindi = useHindi();
  const lv = LEVELS[r.level - 1];
  const en = before ? 'Wonderful! Look how much you learned.' : `You will start at ${lv.name}. Let's learn!`;
  const hi = before ? 'बहुत बढ़िया! देखो तुमने कितना सीखा।' : `तुम ${lv.nameHi} से शुरू करोगे। चलो सीखें!`;
  useSayOnce(hindi ? [[en, 'en', 'cheer'], [hi, 'hi']] : [[en, 'en', 'cheer']]);
  return (
    <div className="screen center" style={{ gap: 16 }}>
      <Confetti run />
      <Mascot size={118} mood="happy" level={r.level} float />
      <div className="muted" style={{ fontWeight: 700 }}>
        <Tr en={before ? 'Your result' : 'You start at'} hi={before ? 'तुम्हारा नतीजा' : 'तुम यहाँ से शुरू करोगे'} />
      </div>
      <div className="glass tint col" style={{ ['--tint' as string]: lv.color, width: '100%', alignItems: 'center', padding: 20, gap: 6 }}>
        <Pic e={lv.emoji} size={84} />
        <h1 style={{ color: lv.color }}>
          Level {lv.n}: {lv.name}
        </h1>
        <div className="muted">{lv.stage}</div>
        <div className="hi muted small">{lv.nameHi} · {lv.stageHi}</div>
      </div>
      <div className="glass col" style={{ width: '100%', textAlign: 'left', padding: 18 }}>
        {SKILLS.map((k) => {
          const now = testPct(r, k);
          const was = before ? testPct(before, k) : null;
          return (
            <div key={k} className="skill">
              <Pic e={SKILL_INFO[k].icon} size={34} flat />
              <div>
                <div className="small" style={{ fontWeight: 700 }}>
                  <Tr en={SKILL_INFO[k].en} hi={SKILL_INFO[k].hi} line />
                </div>
                <div className="bar" style={{ color: SKILL_INFO[k].color }}>
                  <div style={{ width: `${now ?? 0}%`, background: SKILL_INFO[k].color }} />
                  {was !== null && <span className="base" style={{ left: `${was}%` }} />}
                </div>
              </div>
              <span style={{ fontWeight: 800, textAlign: 'right' }}>{now === null ? '–' : `${now}%`}</span>
            </div>
          );
        })}
        {before && <div className="muted small">The white mark shows where you started.</div>}
      </div>
      <button className="btn block gold" onClick={onDone}>
        <Tr en={before ? 'See my progress' : 'Start learning'} hi={before ? 'प्रगति देखो' : 'सीखना शुरू करो'} /> <Icon name="next" size={24} stroke={3} />
      </button>
    </div>
  );
}

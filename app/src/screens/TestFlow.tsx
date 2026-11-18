import { useState } from 'react';
import { LEVELS } from '../content/curriculum';
import { SKILLS, SKILL_INFO } from '../content/types';
import { Confetti, Mascot, useSayOnce } from '../components/ui';
import type { StepResult } from '../lib/engine';
import { testPct } from '../lib/engine';
import { STAGES, scoreTest, stagePassed, stageSteps } from '../lib/placement';
import { sfx } from '../lib/sfx';
import type { Profile, TestResult } from '../lib/store';
import { Player } from './Player';

/** Runs the placement test (form A) or the final test (form B), stage by stage. */
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
            <span>{STAGES[stage].emoji}</span>
            <span className="hi">
              भाग {stage + 1} · {STAGES[stage].hi}
            </span>
          </div>
        }
        onFinish={(s) => finishStage(s.results)}
        onQuit={onQuit}
      />
    );

  if (phase === 'between')
    return (
      <div className="screen center" style={{ gap: 20 }}>
        <Mascot size={130} mood="happy" />
        <h1 className="hi">बहुत बढ़िया! 🎉</h1>
        <div className="muted">Great! Let's try the next part.</div>
        <div className="card row" style={{ width: '100%' }}>
          <span style={{ fontSize: 40 }}>{STAGES[stage + 1].emoji}</span>
          <div style={{ textAlign: 'left' }}>
            <div className="hi" style={{ fontWeight: 800, fontSize: 20 }}>
              भाग {stage + 2}: {STAGES[stage + 1].hi}
            </div>
            <div className="muted small">Part {stage + 2}: {STAGES[stage + 1].en}</div>
          </div>
        </div>
        <button
          className="btn block"
          onClick={() => {
            setStage(stage + 1);
            setPhase('run');
          }}
        >
          आगे · Next ▶
        </button>
      </div>
    );

  return <Result r={result!} before={isFinal ? profile.placement : undefined} onDone={() => onDone(result!)} />;
}

function Intro({ isFinal, name, onGo, onBack }: { isFinal: boolean; name: string; onGo: () => void; onBack: () => void }) {
  useSayOnce(
    isFinal
      ? [['अब दिखाओ तुमने क्या सीखा! कोई चिंता नहीं, बस अपनी पूरी कोशिश करो।', 'hi']]
      : [['चलो देखते हैं तुम्हें कितनी इंग्लिश आती है। गलती हो तो कोई बात नहीं!', 'hi']],
  );
  return (
    <div className="screen center" style={{ gap: 20 }}>
      <Mascot size={140} mood="talk" />
      <h1 className="hi">{isFinal ? 'दिखाओ तुमने क्या सीखा!' : 'तुम्हारी इंग्लिश कहाँ तक है?'}</h1>
      <div className="muted">{isFinal ? `Show what you know, ${name}!` : "Let's find the best place for you to start."}</div>
      <div className="card col" style={{ width: '100%', textAlign: 'left' }}>
        <div className="row hi" style={{ fontWeight: 700 }}>
          <span style={{ fontSize: 28 }}>😌</span> गलती हो तो कोई बात नहीं
        </div>
        <div className="row hi" style={{ fontWeight: 700 }}>
          <span style={{ fontSize: 28 }}>🔊</span> ध्यान से सुनो
        </div>
        <div className="row hi" style={{ fontWeight: 700 }}>
          <span style={{ fontSize: 28 }}>⏱️</span> लगभग 5–10 मिनट
        </div>
        <div className="muted small">Mistakes are OK · Listen carefully · About 5–10 minutes</div>
      </div>
      <button className="btn block" onClick={onGo}>
        शुरू करो · Start ▶
      </button>
      <button className="btn ghost small" onClick={onBack}>
        बाद में · Later
      </button>
    </div>
  );
}

function Result({ r, before, onDone }: { r: TestResult; before?: TestResult; onDone: () => void }) {
  const lv = LEVELS[r.level - 1];
  useSayOnce(
    before
      ? [['बहुत बढ़िया! देखो तुमने कितना सीखा।', 'hi']]
      : [[`तुम ${lv.nameHi} लेवल से शुरू करोगे। चलो सीखें!`, 'hi']],
  );
  return (
    <div className="screen center" style={{ gap: 16 }}>
      <Confetti run />
      <Mascot size={110} mood="happy" />
      <div className="hi muted" style={{ fontWeight: 700 }}>{before ? 'तुम्हारा नतीजा · Your result' : 'तुम यहाँ से शुरू करोगे · You start at'}</div>
      <div className="card col" style={{ width: '100%', alignItems: 'center', borderColor: lv.color }}>
        <div style={{ fontSize: 60 }}>{lv.emoji}</div>
        <h1 style={{ color: lv.color }}>
          Level {lv.n}: {lv.name}
        </h1>
        <div className="hi" style={{ fontSize: 20, fontWeight: 700 }}>{lv.nameHi} · {lv.stageHi}</div>
        <div className="muted small">{lv.stage}</div>
      </div>
      <div className="card col" style={{ width: '100%', textAlign: 'left' }}>
        {SKILLS.map((k) => {
          const now = testPct(r, k);
          const was = before ? testPct(before, k) : null;
          return (
            <div key={k} className="skill">
              <span className="ico">{SKILL_INFO[k].icon}</span>
              <div>
                <div className="small" style={{ fontWeight: 700 }}>
                  <span className="hi">{SKILL_INFO[k].hi}</span> · {SKILL_INFO[k].en}
                </div>
                <div className="bar">
                  <div style={{ width: `${now ?? 0}%`, background: SKILL_INFO[k].color }} />
                  {was !== null && <span className="base" style={{ left: `${was}%` }} />}
                </div>
              </div>
              <span style={{ fontWeight: 800, textAlign: 'right' }}>{now === null ? '–' : `${now}%`}</span>
            </div>
          );
        })}
        {before && <div className="muted small">▏= before · पहले</div>}
      </div>
      <button className="btn block" onClick={onDone}>
        {before ? 'देखो · See progress' : 'सीखना शुरू करो · Start learning'} ▶
      </button>
    </div>
  );
}

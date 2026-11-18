import { useEffect, useRef, useState } from 'react';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { Speaker, Tr } from '../components/ui';
import type { Step } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { canRecognize, canRecord, recognizeOnce, recordClip, speak, speakSeq, speechMatch } from '../lib/speech';
import type { ActProps } from './Choice';

type SayStep = Extract<Step, { kind: 'say' }>;
type WriteStep = Extract<Step, { kind: 'write' }>;

/**
 * Speaking practice. Uses speech recognition when the phone supports it (gentle,
 * lenient feedback). Otherwise records the learner so they can listen to themselves.
 * Speaking never blocks progress.
 */
export function Say({ step, intro, showHi, test, onDone }: ActProps<SayStep>) {
  const [state, setState] = useState<'ready' | 'listening' | 'heard' | 'recorded' | 'done'>('ready');
  const [heard, setHeard] = useState('');
  const [clip, setClip] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const cancel = useRef<() => void>(() => {});
  const [noMic, setNoMic] = useState(false);
  const recog = canRecognize() && !noMic;
  const rec = canRecord() && !noMic;

  useEffect(() => {
    setState('ready');
    setTries(0);
    setHeard('');
    setClip(null);
    const t = setTimeout(() => void speakSeq([...intro, [step.text, 'en', 'word']]), 250);
    return () => {
      clearTimeout(t);
      cancel.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  const finish = (correct: boolean, scored: boolean, assisted = false) => {
    setState('done');
    onDone({ correct, assisted, scored });
  };

  const listen = async () => {
    if (recog) {
      setState('listening');
      const r = recognizeOnce(7000);
      cancel.current = r.cancel;
      const alts = await r.promise;
      if (test) {
        if (alts) setHeard(alts[0]);
        finish(!!alts && speechMatch(step.text, alts) >= 0.6, !!alts);
        return;
      }
      if (!alts) {
        if (tries >= 1) setNoMic(true);
        setState('ready');
        setHeard('');
        void speak("I didn't hear you. Tap the mic and try again.");
        const t = tries + 1;
        setTries(t);
        if (t >= 3) finish(false, false);
        return;
      }
      setHeard(alts[0]);
      const score = speechMatch(step.text, alts);
      if (score >= 0.6) {
        sfx.correct();
        setState('heard');
        void speak('Well said!', 'en', { tone: 'cheer' });
        finish(true, true, tries > 0);
      } else {
        const t = tries + 1;
        setTries(t);
        setState('heard');
        if (t >= 2) {
          void speakSeq([['Good try! Listen, and say it with me.', 'en'], [step.text, 'en', 'word']], { record: false });
          finish(false, true, false);
        } else {
          void speakSeq([['Almost! Listen once more.', 'en'], [step.text, 'en', 'word']], { record: false });
        }
      }
      return;
    }
    if (rec) {
      setState('listening');
      const url = await recordClip(Math.min(6000, 2000 + step.text.length * 90));
      if (url) {
        setClip(url);
        setState('recorded');
        try {
          await new Audio(url).play();
        } catch {
          /* ignore */
        }
      } else {
        setNoMic(true);
        setState('ready');
      }
    }
  };

  return (
    <>
      <div className="prompt">
        {step.emoji && <Pic e={step.emoji} size={96} />}
        <div className="big-sentence" style={{ fontSize: step.text.length > 24 ? 24 : 32 }}>
          {step.text}
        </div>
        {step.hi && showHi && <div className="hi muted">{step.hi}</div>}
        <Speaker audio={[[step.text, 'en', 'word']]} size="sm" />
      </div>
      <div className="col" style={{ alignItems: 'center', gap: 14 }}>
        {(recog || rec) && state !== 'done' && state !== 'recorded' && (
          <button className={`mic ${state === 'listening' ? 'on' : ''}`} onClick={listen} disabled={state === 'listening'} aria-label="Speak">
            <Icon name="mic" size={52} stroke={2.4} />
          </button>
        )}
        <div style={{ fontWeight: 700, textAlign: 'center', minHeight: 28 }}>
          {state === 'listening' ? (
            <Tr en="Speak now… I am listening" hi="बोलो… मैं सुन रहा हूँ" />
          ) : state === 'heard' && heard ? (
            <span>I heard: “{heard}”</span>
          ) : recog || rec ? (
            <Tr en="Tap the mic and say it" hi="माइक दबाओ और बोलो" />
          ) : (
            <Tr en="Say it out loud, then go on" hi="ज़ोर से बोलो, फिर आगे बढ़ो" />
          )}
        </div>
        {state === 'recorded' && clip && (
          <div className="col" style={{ width: '100%' }}>
            <button className="btn ghost block" onClick={() => void new Audio(clip).play().catch(() => {})}>
              <Icon name="play" size={22} /> <Tr en="Hear yourself" hi="अपनी आवाज़ सुनो" />
            </button>
            <div className="row">
              <button className="btn ghost" style={{ flex: 1 }} onClick={() => setState('ready')}>
                <Icon name="repeat" size={22} /> Again
              </button>
              <button className="btn good" style={{ flex: 1 }} onClick={() => finish(true, false)}>
                <Icon name="check" size={24} stroke={3} /> I said it
              </button>
            </div>
          </div>
        )}
        {!recog && !rec && state !== 'done' && (
          <button className="btn good block" onClick={() => finish(true, false)}>
            <Icon name="check" size={24} stroke={3} /> <Tr en="I said it" hi="मैंने बोला" />
          </button>
        )}
        {(test || recog) && state !== 'done' && state !== 'listening' && (test || tries > 0) && (
          <button className="btn ghost small" onClick={() => finish(false, false)}>
            Skip for now
          </button>
        )}
      </div>
    </>
  );
}

/** Free writing for the learner's portfolio. Not scored. */
export function Write({ step, intro, showHi, onDone, onWrite }: ActProps<WriteStep> & { onWrite: (text: string) => void }) {
  const [text, setText] = useState('');
  useEffect(() => {
    setText('');
    void speakSeq([...intro, [step.promptEn, 'en']]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);
  return (
    <>
      <div className="card col">
        <div className="read" style={{ fontSize: 23, fontWeight: 700 }}>{step.promptEn}</div>
        {showHi && <div className="hi muted">{step.promptHi}</div>}
      </div>
      <textarea id="write-box" className="text-input read" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="I ..." autoCapitalize="sentences" />
      <div className="row">
        <button className="btn ghost" onClick={() => onDone({ correct: true, assisted: false, scored: false })} aria-label="Skip">
          <Icon name="next" size={24} />
        </button>
        <button
          className="btn good block"
          disabled={text.trim().split(/\s+/).length < 2}
          onClick={() => {
            sfx.correct();
            void speak(text.trim(), 'en', { tone: 'story' });
            onWrite(text.trim());
          }}
        >
          <Icon name="check" size={24} stroke={3} /> <Tr en="Save" hi="सेव करो" />
        </button>
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { Step } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { canRecognize, canRecord, recognizeOnce, recordClip, speak, speakSeq, speechMatch } from '../lib/speech';
import { Speaker } from '../components/ui';
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
    const t = setTimeout(() => void speakSeq([...intro, [step.text, 'en']]), 250);
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
        // One try only in tests; unscored if nothing was heard
        if (alts) setHeard(alts[0]);
        finish(!!alts && speechMatch(step.text, alts) >= 0.6, !!alts);
        return;
      }
      if (!alts) {
        if (tries >= 1) setNoMic(true);
        setState('ready');
        setHeard('');
        void speak(showHi ? 'मुझे सुनाई नहीं दिया। माइक दबाकर फिर से बोलो' : "I didn't hear you. Tap and try again", showHi ? 'hi' : 'en');
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
        void speak(showHi ? 'बहुत अच्छा बोला!' : 'Well said!', showHi ? 'hi' : 'en');
        finish(true, true, tries > 0);
      } else {
        const t = tries + 1;
        setTries(t);
        setState('heard');
        if (t >= 2) {
          void speak(showHi ? 'अच्छी कोशिश! सुनो और साथ बोलो' : 'Good try! Listen and say it with me', showHi ? 'hi' : 'en').then(() => speak(step.text));
          finish(false, true, false);
        } else {
          void speakSeq([[showHi ? 'लगभग सही! एक बार और सुनो' : 'Almost! Listen once more', showHi ? 'hi' : 'en'], [step.text, 'en']]);
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
        // Mic blocked: let the learner say it aloud and carry on
        setNoMic(true);
        setState('ready');
      }
      return;
    }
  };

  return (
    <>
      <div className="prompt">
        {step.emoji && <div className="big-emoji" style={{ fontSize: 72 }}>{step.emoji}</div>}
        <div className="big-sentence" style={{ fontSize: step.text.length > 24 ? 24 : 32 }}>{step.text}</div>
        {step.hi && showHi && <div className="hi muted">{step.hi}</div>}
        <Speaker audio={[[step.text, 'en']]} size="sm" />
      </div>
      <div className="col" style={{ alignItems: 'center', gap: 14 }}>
        {(recog || rec) && state !== 'done' && state !== 'recorded' && (
          <button className={`mic ${state === 'listening' ? 'on' : ''}`} onClick={listen} disabled={state === 'listening'} aria-label="Speak">
            🎤
          </button>
        )}
        <div className="hi" style={{ fontWeight: 700, textAlign: 'center', minHeight: 26 }}>
          {state === 'listening'
            ? showHi
              ? 'बोलो... मैं सुन रहा हूँ 👂'
              : 'Speak now... I am listening 👂'
            : state === 'heard' && heard
              ? `${showHi ? 'मैंने सुना' : 'I heard'}: “${heard}”`
              : recog || rec
                ? showHi
                  ? 'माइक दबाओ और बोलो'
                  : 'Tap the mic and say it'
                : showHi
                  ? 'ज़ोर से बोलो, फिर आगे बढ़ो'
                  : 'Say it out loud, then go on'}
        </div>
        {state === 'recorded' && clip && (
          <div className="col" style={{ width: '100%' }}>
            <button className="btn ghost block" onClick={() => void new Audio(clip).play().catch(() => {})}>
              ▶️ {showHi ? 'अपनी आवाज़ सुनो' : 'Hear yourself'}
            </button>
            <div className="row">
              <button className="btn ghost" style={{ flex: 1 }} onClick={() => setState('ready')}>
                🔁 {showHi ? 'फिर से' : 'Again'}
              </button>
              <button className="btn good" style={{ flex: 1 }} onClick={() => finish(true, false)}>
                👍 {showHi ? 'मैंने बोला' : 'I said it'}
              </button>
            </div>
          </div>
        )}
        {!recog && !rec && state !== 'done' && (
          <button className="btn good block" onClick={() => finish(true, false)}>
            👍 {showHi ? 'मैंने बोला' : 'I said it'}
          </button>
        )}
        {(test || recog) && state !== 'done' && state !== 'listening' && (test || tries > 0) && (
          <button className="btn ghost small" onClick={() => finish(false, false)}>
            {showHi ? 'बाद में करूँगा ⏭️' : 'Skip for now ⏭️'}
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
        <div style={{ fontSize: 22, fontWeight: 800 }}>{step.promptEn}</div>
        {showHi && <div className="hi muted">{step.promptHi}</div>}
      </div>
      <textarea className="text-input" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="I ..." autoCapitalize="sentences" />
      <div className="row">
        <button className="btn ghost" onClick={() => onDone({ correct: true, assisted: false, scored: false })}>
          ⏭️
        </button>
        <button
          className="btn teal block"
          disabled={text.trim().split(/\s+/).length < 2}
          onClick={() => {
            sfx.correct();
            void speak(text.trim());
            onWrite(text.trim());
          }}
        >
          💾 {showHi ? 'सेव करो' : 'Save'}
        </button>
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { PASSAGES } from '../content/sentences';
import { LETTER_MAP, SIGHT, WORDS } from '../content/words';
import type { Audio, Step } from '../lib/engine';
import { speak, speakSeq, stopSpeaking } from '../lib/speech';
import { Speaker } from '../components/ui';
import type { ActProps } from './Choice';

type T<K extends Step['kind']> = Extract<Step, { kind: K }>;

function useAuto(stepId: string, audio: Audio, delay = 300) {
  useEffect(() => {
    const t = setTimeout(() => void speakSeq(audio), delay);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);
}

function HindiLine({ hi, show }: { hi: string; show: boolean }) {
  const [open, setOpen] = useState(show);
  useEffect(() => setOpen(show), [show, hi]);
  if (open) return <div className="meaning hi">{hi}</div>;
  return (
    <button
      className="hi-toggle hi"
      onClick={() => {
        setOpen(true);
        void speak(hi, 'hi');
      }}
    >
      हिंदी में मतलब 👁️
    </button>
  );
}

function Next({ onDone, label }: { onDone: ActProps<Step>['onDone']; label: string }) {
  return (
    <button className="btn block" onClick={() => onDone({ correct: true, assisted: false, scored: false })}>
      {label} ▶
    </button>
  );
}

export function TeachWord({ step, intro, showHi, onDone }: ActProps<T<'teachWord'>>) {
  const w = step.word;
  const audio: Audio = showHi ? [[w.en, 'en'], [w.hi, 'hi'], [w.en, 'en']] : [[w.en, 'en'], [w.en, 'en']];
  useAuto(step.id, [...intro, ...audio]);
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="pic">{w.emoji}</div>
      <div className="word">
        <span className="first">{w.en[0]}</span>
        {w.en.slice(1)}
      </div>
      <HindiLine hi={w.hi} show={showHi} />
      <div className="row">
        <Speaker audio={audio} />
        <button className="icon-btn" style={{ width: 60, height: 60 }} onClick={() => void speak(w.en, 'en', { rate: 0.5 })} aria-label="Slow">
          🐢
        </button>
      </div>
      <div className="spacer" />
      <Next onDone={onDone} label={showHi ? 'आगे' : 'Next'} />
    </div>
  );
}

export function TeachLetter({ step, intro, showHi, onDone }: ActProps<T<'teachLetter'>>) {
  const L = LETTER_MAP[step.ch];
  const w = WORDS[L.word];
  const U = step.ch.toUpperCase();
  const audio: Audio = showHi
    ? [[U, 'en'], [`${U} for ${w.en}`, 'en'], [`${U} से ${w.en}, ${w.hi}`, 'hi'], [`${w.en}`, 'en']]
    : [[U, 'en'], [`${U} for ${w.en}`, 'en']];
  useAuto(step.id, [...intro, ...audio]);
  const word = w.en;
  const idx = word.indexOf(step.ch);
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="letter-pair" style={{ animation: 'pop .5s' }}>
        <span className="U">{U}</span>
        <span className="u">{step.ch}</span>
      </div>
      <div className="card row" style={{ gap: 16, padding: '10px 20px' }}>
        <span style={{ fontSize: 64 }}>{w.emoji}</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>
            {word.slice(0, idx)}
            <span style={{ color: 'var(--primary)' }}>{step.ch}</span>
            {word.slice(idx + 1)}
          </div>
          {showHi && <div className="hi muted" style={{ fontSize: 20 }}>{w.hi}</div>}
        </div>
      </div>
      <Speaker audio={audio} />
      <div className="spacer" />
      <Next onDone={onDone} label={showHi ? 'आगे' : 'Next'} />
    </div>
  );
}

export function TeachBlend({ step, intro, showHi, onDone }: ActProps<T<'teachBlend'>>) {
  const w = step.word;
  const letters = w.en.split('');
  const [lit, setLit] = useState(-1);
  const [joined, setJoined] = useState(false);
  const run = useRef(0);

  const play = async () => {
    const me = ++run.current;
    setJoined(false);
    for (let i = 0; i < letters.length; i++) {
      if (me !== run.current) return;
      setLit(i);
      await speak(letters[i].toUpperCase(), 'en', { rate: 0.8 });
      await new Promise((r) => setTimeout(r, 150));
    }
    if (me !== run.current) return;
    setLit(-1);
    setJoined(true);
    await speak(w.en, 'en', { rate: 0.45 });
    await new Promise((r) => setTimeout(r, 200));
    await speak(w.en, 'en');
    if (showHi && me === run.current) await speak(w.hi, 'hi');
  };

  useEffect(() => {
    const t = setTimeout(async () => {
      await speakSeq(intro);
      void play();
    }, 300);
    return () => {
      clearTimeout(t);
      run.current++;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className={`blend ${joined ? 'joined' : ''}`}>
        {letters.map((c, i) => (
          <span key={i} className={lit === i ? 'lit' : ''}>
            {c}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--muted)' }}>↓</div>
      <div className="pic" style={{ opacity: joined ? 1 : 0.15, transition: 'opacity .4s', width: 170, height: 170, fontSize: 96 }}>
        {w.emoji}
      </div>
      <div className="word" style={{ fontSize: 46 }}>{w.en}</div>
      {joined && <HindiLine hi={w.hi} show={showHi} />}
      <button className="speaker" onClick={() => void play()} aria-label="Listen">
        🔊
      </button>
      <div className="spacer" />
      <Next onDone={onDone} label={showHi ? 'आगे' : 'Next'} />
    </div>
  );
}

export function TeachSight({ step, intro, showHi, onDone }: ActProps<T<'teachSight'>>) {
  const s = SIGHT[step.sight];
  const audio: Audio = [[step.sight, 'en'], ...(showHi ? ([[s.hi, 'hi']] as Audio) : []), [s.example, 'en']];
  useAuto(step.id, [...intro, ...audio]);
  const parts = s.example.split(new RegExp(`\\b(${step.sight})\\b`));
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="pic" style={{ fontSize: 76, fontWeight: 800, color: 'var(--violet)' }}>{step.sight}</div>
      <HindiLine hi={s.hi} show={showHi} />
      <div className="big-sentence">
        {parts.map((p, i) =>
          p === step.sight ? (
            <span key={i} style={{ background: '#ffe2a8', borderRadius: 8, padding: '0 6px' }}>
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
      {showHi && <div className="hi muted">{s.exampleHi}</div>}
      <Speaker audio={audio} />
      <div className="spacer" />
      <Next onDone={onDone} label={showHi ? 'आगे' : 'Next'} />
    </div>
  );
}

/** Read a sentence aloud word-by-word with highlighting. */
function ReadingLine({ text, auto, intro, size = 30 }: { text: string; auto: boolean; intro?: Audio; size?: number }) {
  const words = text.split(' ');
  const [lit, setLit] = useState(-1);
  const run = useRef(0);
  const play = async () => {
    const me = ++run.current;
    const ms = 360;
    const p = speak(text, 'en', { rate: 0.8 });
    for (let i = 0; i < words.length; i++) {
      if (me !== run.current) return;
      setLit(i);
      await new Promise((r) => setTimeout(r, ms + words[i].length * 35));
    }
    await p;
    if (me === run.current) setLit(-1);
  };
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(async () => {
      if (intro?.length) await speakSeq(intro);
      void play();
    }, 300);
    return () => {
      clearTimeout(t);
      run.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return (
    <div className="col" style={{ alignItems: 'center' }}>
      <div className="sentence-words" style={{ fontSize: size }}>
        {words.map((w, i) => (
          <button key={i} className={lit === i ? 'lit' : ''} onClick={() => void speak(w.replace(/[.?!,]/g, ''))}>
            {w}
          </button>
        ))}
      </div>
      <button className="speaker sm" onClick={() => void play()} aria-label="Listen">
        🔊
      </button>
    </div>
  );
}

export function TeachSentence({ step, intro, showHi, onDone }: ActProps<T<'teachSentence'>>) {
  useEffect(() => () => stopSpeaking(), []);
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="pic" style={{ fontSize: step.scene.length > 3 ? 84 : 110 }}>{step.scene}</div>
      <ReadingLine key={step.id} text={step.en} auto intro={intro} />
      <HindiLine hi={step.hi} show={showHi} />
      <div className="small muted hi">{showHi ? 'किसी भी शब्द को दबाकर सुनो' : 'Tap any word to hear it'}</div>
      <div className="spacer" />
      <Next onDone={onDone} label={showHi ? 'आगे' : 'Next'} />
    </div>
  );
}

export function TeachDialogue({ step, intro, showHi, onDone }: ActProps<T<'teachDialogue'>>) {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    setShown(1);
    let alive = true;
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      await speakSeq([...intro, [step.q, 'en']]);
      if (!alive) return;
      setShown(2);
      await speak(step.a, 'en');
    })();
    return () => {
      alive = false;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);
  return (
    <div className="teach" style={{ flex: 1 }}>
      <div className="big-emoji">{step.scene}</div>
      <div className="dialogue">
        <button className="say-line" onClick={() => void speak(step.q)}>
          <span className="who">🧑</span>
          <span className="b">
            <div className="en">{step.q}</div>
            {showHi && <div className="hi">{step.qhi}</div>}
          </span>
        </button>
        {shown >= 2 && (
          <button className="say-line right" onClick={() => void speak(step.a)} style={{ animation: 'fadeUp .3s' }}>
            <span className="who">🙋</span>
            <span className="b">
              <div className="en">{step.a}</div>
              {showHi && <div className="hi">{step.ahi}</div>}
            </span>
          </button>
        )}
      </div>
      <Speaker audio={[[step.q, 'en'], [step.a, 'en']]} size="sm" />
      <div className="spacer" />
      <Next onDone={onDone} label={showHi ? 'आगे' : 'Next'} />
    </div>
  );
}

export function ReadAlong({ step, intro, showHi, onDone }: ActProps<T<'readAlong'>>) {
  const p = PASSAGES[step.passageId];
  const [cur, setCur] = useState(-1);
  const [hiOpen, setHiOpen] = useState<number[]>([]);
  const [played, setPlayed] = useState(false);
  const run = useRef(0);

  const playAll = async () => {
    const me = ++run.current;
    for (let i = 0; i < p.lines.length; i++) {
      if (me !== run.current) return;
      setCur(i);
      await speak(p.lines[i].en, 'en', { rate: 0.8 });
      await new Promise((r) => setTimeout(r, 350));
    }
    if (me === run.current) {
      setCur(-1);
      setPlayed(true);
    }
  };

  useEffect(() => {
    const t = setTimeout(async () => {
      await speakSeq([...intro, [p.title, 'en']]);
      void playAll();
    }, 300);
    const t2 = setTimeout(() => setPlayed(true), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      run.current++;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  return (
    <div className="col" style={{ flex: 1 }}>
      <div className="row" style={{ justifyContent: 'center' }}>
        <span style={{ fontSize: 46 }}>{p.emoji}</span>
        <div>
          <h2>{p.title}</h2>
          {showHi && <div className="hi muted">{p.titleHi}</div>}
        </div>
      </div>
      <div className="card col" style={{ gap: 6, padding: 10 }}>
        {p.lines.map((ln, i) => (
          <div key={i} className="row" style={{ alignItems: 'flex-start', padding: '6px 6px', borderRadius: 14, background: cur === i ? '#fff1d0' : undefined, transition: 'background .2s' }}>
            <span style={{ fontSize: 26, minWidth: 64, textAlign: 'center', flex: 'none', whiteSpace: 'nowrap' }}>{ln.scene}</span>
            <div style={{ flex: 1 }}>
              <button style={{ fontSize: 22, fontWeight: 700, textAlign: 'left', lineHeight: 1.3 }} onClick={() => void speak(ln.en, 'en', { rate: 0.8 })}>
                {ln.en}
              </button>
              {hiOpen.includes(i) && <div className="hi muted" style={{ fontSize: 17 }}>{ln.hi}</div>}
            </div>
            {!hiOpen.includes(i) && (
              <button className="chip hi" style={{ fontSize: 13, flex: 'none' }} onClick={() => setHiOpen([...hiOpen, i])}>
                हिंदी
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn ghost small" onClick={() => void playAll()}>
          🔊 {showHi ? 'पूरी कहानी सुनो' : 'Listen to the story'}
        </button>
      </div>
      <div className="spacer" />
      {played && <Next onDone={onDone} label={showHi ? 'सवाल शुरू करो' : 'Start questions'} />}
    </div>
  );
}

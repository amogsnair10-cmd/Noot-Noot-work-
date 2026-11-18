import { useEffect, useRef, useState } from 'react';
import { PASSAGES } from '../content/sentences';
import { LETTER_MAP, SIGHT, WORDS } from '../content/words';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { Speaker, Tr } from '../components/ui';
import type { Audio, Step } from '../lib/engine';
import { setReplay, speak, speakSeq, stopSpeaking } from '../lib/speech';
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

/** Hindi meaning: shown as a translation chip. Tap to hear it when it is hidden. */
function HindiLine({ hi, show }: { hi: string; show: boolean }) {
  const [open, setOpen] = useState(show);
  useEffect(() => setOpen(show), [show, hi]);
  if (open) return <div className="meaning hi">{hi}</div>;
  return (
    <button
      className="hi-toggle"
      onClick={() => {
        setOpen(true);
        void speak(hi, 'hi');
      }}
    >
      <Icon name="translate" size={18} style={{ verticalAlign: -3 }} /> Hindi meaning
    </button>
  );
}

function Next({ onDone, label = 'Next', hi = 'आगे' }: { onDone: ActProps<Step>['onDone']; label?: string; hi?: string }) {
  return (
    <button className="btn block" onClick={() => onDone({ correct: true, assisted: false, scored: false })}>
      <Tr en={label} hi={hi} /> <Icon name="next" size={24} stroke={3} />
    </button>
  );
}

export function TeachWord({ step, intro, showHi, onDone }: ActProps<T<'teachWord'>>) {
  const w = step.word;
  const audio: Audio = showHi ? [[w.en, 'en'], [w.hi, 'hi'], [w.en, 'en']] : [[w.en, 'en'], [w.en, 'en']];
  useAuto(step.id, [...intro, ...audio]);
  useEffect(() => setReplay([...intro, ...audio]), [step.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="stage-pic">
        <Pic e={w.emoji} size={156} />
      </div>
      <div className="word">
        <span className="first">{w.en[0]}</span>
        {w.en.slice(1)}
      </div>
      <HindiLine hi={w.hi} show={showHi} />
      <div className="row">
        <Speaker audio={audio} />
        <button className="icon-btn" style={{ width: 62, height: 62, borderRadius: 22 }} onClick={() => void speak(w.en, 'en', { rate: 0.5 })} aria-label="Say it slowly">
          <Icon name="turtle" size={32} />
        </button>
      </div>
      <div className="spacer" />
      <Next onDone={onDone} />
    </div>
  );
}

export function TeachLetter({ step, intro, showHi, onDone }: ActProps<T<'teachLetter'>>) {
  const L = LETTER_MAP[step.ch];
  const w = WORDS[L.word];
  const U = step.ch.toUpperCase();
  const audio: Audio = showHi ? [[U, 'en'], [`${U} for ${w.en}`, 'en'], [w.hi, 'hi'], [w.en, 'en']] : [[U, 'en'], [`${U} for ${w.en}`, 'en']];
  useAuto(step.id, [...intro, ...audio]);
  useEffect(() => setReplay([...intro, ...audio]), [step.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const word = w.en;
  const idx = word.indexOf(step.ch);
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="letter-pair" style={{ animation: 'pop .5s' }}>
        <span className="U">{U}</span>
        <span className="u">{step.ch}</span>
      </div>
      <div className="card row" style={{ gap: 16, padding: '10px 22px 10px 14px' }}>
        <Pic e={w.emoji} size={84} />
        <div style={{ textAlign: 'left' }}>
          <div className="read" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>
            {word.slice(0, idx)}
            <span style={{ color: 'var(--gold)' }}>{step.ch}</span>
            {word.slice(idx + 1)}
          </div>
          {showHi && <div className="hi muted" style={{ fontSize: 19 }}>{w.hi}</div>}
        </div>
      </div>
      <Speaker audio={audio} />
      <div className="spacer" />
      <Next onDone={onDone} />
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
      await speak(letters[i].toUpperCase(), 'en', { tone: 'word' });
      await new Promise((r) => setTimeout(r, 150));
    }
    if (me !== run.current) return;
    setLit(-1);
    setJoined(true);
    await speak(w.en, 'en', { rate: 0.45 });
    await new Promise((r) => setTimeout(r, 200));
    await speak(w.en, 'en', { tone: 'cheer' });
    if (showHi && me === run.current) await speak(w.hi, 'hi');
  };

  useEffect(() => {
    setReplay([...intro, [letters.join(' ').toUpperCase(), 'en'], [w.en, 'en']]);
    const t = setTimeout(async () => {
      await speakSeq(intro, { record: false });
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
      <div style={{ opacity: 0.6 }}>
        <Icon name="next" size={30} style={{ transform: 'rotate(90deg)' }} />
      </div>
      <div className="stage-pic" style={{ width: 190, height: 190, opacity: joined ? 1 : 0.2, transition: 'opacity .4s' }}>
        <Pic e={w.emoji} size={124} />
      </div>
      <div className="word" style={{ fontSize: 48 }}>{w.en}</div>
      {joined && <HindiLine hi={w.hi} show={showHi} />}
      <button className="speaker" onClick={() => void play()} aria-label="Listen again">
        <Icon name="speaker" size={38} stroke={2.6} />
      </button>
      <div className="spacer" />
      <Next onDone={onDone} />
    </div>
  );
}

export function TeachSight({ step, intro, showHi, onDone }: ActProps<T<'teachSight'>>) {
  const s = SIGHT[step.sight];
  const audio: Audio = [[step.sight, 'en'], ...(showHi ? ([[s.hi, 'hi']] as Audio) : []), [s.example, 'en']];
  useAuto(step.id, [...intro, ...audio]);
  useEffect(() => setReplay([...intro, ...audio]), [step.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const parts = s.example.split(new RegExp(`\\b(${step.sight})\\b`));
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="stage-pic" style={{ width: 200, height: 200 }}>
        <span className="read" style={{ fontSize: 76, fontWeight: 700, background: 'linear-gradient(180deg,#fff,#b79bff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{step.sight}</span>
      </div>
      <HindiLine hi={s.hi} show={showHi} />
      <div className="big-sentence">
        {parts.map((p, i) =>
          p === step.sight ? (
            <span key={i} style={{ background: 'rgba(255,200,87,.35)', borderRadius: 8, padding: '0 6px', boxShadow: '0 0 18px rgba(255,200,87,.4)' }}>
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
      <Next onDone={onDone} />
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
    const ms = 340;
    const p = speak(text, 'en', { tone: 'story' });
    for (let i = 0; i < words.length; i++) {
      if (me !== run.current) return;
      setLit(i);
      await new Promise((r) => setTimeout(r, ms + words[i].length * 35));
    }
    await p;
    if (me === run.current) setLit(-1);
  };
  useEffect(() => {
    setReplay([...(intro ?? []), [text, 'en', 'story']]);
    if (!auto) return;
    const t = setTimeout(async () => {
      if (intro?.length) await speakSeq(intro, { record: false });
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
          <button key={i} className={lit === i ? 'lit' : ''} onClick={() => void speak(w.replace(/[.?!,]/g, ''), 'en', { tone: 'word' })}>
            {w}
          </button>
        ))}
      </div>
      <button className="speaker sm" onClick={() => void play()} aria-label="Listen again">
        <Icon name="speaker" size={26} stroke={2.6} />
      </button>
    </div>
  );
}

export function TeachSentence({ step, intro, showHi, onDone }: ActProps<T<'teachSentence'>>) {
  useEffect(() => () => stopSpeaking(), []);
  return (
    <div className="teach" style={{ flex: 1, justifyContent: 'center' }}>
      <div className="stage-pic" style={{ width: 210, height: 210 }}>
        <Pic e={step.scene} size={step.scene.length > 3 ? 150 : 140} />
      </div>
      <ReadingLine key={step.id} text={step.en} auto intro={intro} />
      <HindiLine hi={step.hi} show={showHi} />
      <div className="small muted">Tap any word to hear it</div>
      <div className="spacer" />
      <Next onDone={onDone} />
    </div>
  );
}

export function TeachDialogue({ step, intro, showHi, onDone }: ActProps<T<'teachDialogue'>>) {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    setShown(1);
    setReplay([...intro, [step.q, 'en'], [step.a, 'en']]);
    let alive = true;
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      await speakSeq([...intro, [step.q, 'en']], { record: false });
      if (!alive) return;
      setShown(2);
      await speak(step.a, 'en', { tone: 'cheer' });
    })();
    return () => {
      alive = false;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);
  return (
    <div className="teach" style={{ flex: 1 }}>
      <Pic e={step.scene} size={112} />
      <div className="dialogue">
        <button className="say-line" onClick={() => void speak(step.q)}>
          <Pic e="🧑" size={50} flat />
          <span className="b">
            <div className="en">{step.q}</div>
            {showHi && <div className="hi-tr hi">{step.qhi}</div>}
          </span>
        </button>
        {shown >= 2 && (
          <button className="say-line right" onClick={() => void speak(step.a)} style={{ animation: 'rise .3s' }}>
            <Pic e="🙋" size={50} flat />
            <span className="b">
              <div className="en">{step.a}</div>
              {showHi && <div className="hi-tr hi">{step.ahi}</div>}
            </span>
          </button>
        )}
      </div>
      <Speaker audio={[[step.q, 'en'], [step.a, 'en']]} size="sm" />
      <div className="spacer" />
      <Next onDone={onDone} />
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
      await speak(p.lines[i].en, 'en', { tone: 'story' });
      await new Promise((r) => setTimeout(r, 350));
    }
    if (me === run.current) {
      setCur(-1);
      setPlayed(true);
    }
  };

  useEffect(() => {
    setReplay([[p.title, 'en'], ...p.lines.map((l) => [l.en, 'en', 'story'] as [string, 'en', 'story']) ]);
    const t = setTimeout(async () => {
      await speakSeq([...intro, [p.title, 'en']], { record: false });
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
        <Pic e={p.emoji} size={70} />
        <div>
          <h2>{p.title}</h2>
          {showHi && <div className="hi muted">{p.titleHi}</div>}
        </div>
      </div>
      <div className="card col" style={{ gap: 6, padding: 10 }}>
        {p.lines.map((ln, i) => (
          <div key={i} className="row" style={{ alignItems: 'center', padding: '6px', borderRadius: 18, background: cur === i ? 'rgba(255,200,87,.22)' : undefined, boxShadow: cur === i ? '0 0 24px rgba(255,200,87,.3)' : undefined, transition: 'all .25s' }}>
            <span style={{ width: 72, flex: 'none', display: 'grid', placeItems: 'center' }}>
              <Pic e={ln.scene} size={56} />
            </span>
            <div style={{ flex: 1 }}>
              <button className="read" style={{ fontSize: 22, fontWeight: 700, textAlign: 'left', lineHeight: 1.3 }} onClick={() => void speak(ln.en, 'en', { tone: 'story' })}>
                {ln.en}
              </button>
              {hiOpen.includes(i) && <div className="hi muted" style={{ fontSize: 17 }}>{ln.hi}</div>}
            </div>
            {!hiOpen.includes(i) && (
              <button className="chip" style={{ fontSize: 13, flex: 'none' }} onClick={() => setHiOpen([...hiOpen, i])} aria-label="Show Hindi">
                <Icon name="translate" size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn ghost small" onClick={() => void playAll()}>
          <Icon name="speaker" size={22} /> Listen to the story
        </button>
      </div>
      <div className="spacer" />
      {played && <Next onDone={onDone} label="Start questions" hi="सवाल शुरू करो" />}
    </div>
  );
}

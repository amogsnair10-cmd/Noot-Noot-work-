import { useEffect, useState } from 'react';
import type { Step } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { speak, speakSeq } from '../lib/speech';
import { Pic } from '../components/Doodle';
import { Speaker } from '../components/ui';
import type { ActProps } from './Choice';

type BuildStep = Extract<Step, { kind: 'build' }>;
type OrderStep = Extract<Step, { kind: 'order' }>;

/** Spell a word by tapping letter tiles in order. */
export function Build({ step, intro, test, onDone }: ActProps<BuildStep>) {
  const target = step.word.split('');
  const [filled, setFilled] = useState<number[]>([]); // tile indexes used, in order
  const [bad, setBad] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = filled.length === target.length;

  useEffect(() => {
    setFilled([]);
    setMistakes(0);
    const t = setTimeout(() => void speakSeq([...intro, [step.word, 'en']]), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  const need = target[filled.length];
  const hintIdx = !test && mistakes >= 2 && !done ? step.tiles.findIndex((t, i) => t === need && !filled.includes(i)) : -1;

  const tap = (i: number) => {
    if (done || filled.includes(i)) return;
    if (step.tiles[i] === need) {
      sfx.tap();
      const nf = [...filled, i];
      setFilled(nf);
      if (nf.length === target.length) {
        sfx.correct();
        void speak(step.word, 'en', { tone: 'cheer' });
        onDone({ correct: mistakes === 0, assisted: mistakes > 0 });
      }
    } else {
      sfx.wrong();
      setBad(i);
      setMistakes((m) => m + 1);
      setTimeout(() => setBad(null), 420);
    }
  };

  return (
    <>
      <div className="prompt">
        {step.emoji && <Pic e={step.emoji} size={104} />}
        <Speaker audio={[[step.word, 'en']]} size="sm" />
      </div>
      <div className="slots" aria-label="Your word">
        {target.map((_, k) => (
          <div key={k} className={`slot ${filled[k] !== undefined ? 'filled' : ''}`}>
            {filled[k] !== undefined ? step.tiles[filled[k]] : ''}
          </div>
        ))}
      </div>
      <div className="tiles">
        {step.tiles.map((t, i) => (
          <button key={i} className={`tile ${filled.includes(i) ? 'used' : ''} ${bad === i ? 'bad' : ''} ${hintIdx === i ? 'hint' : ''}`} onClick={() => tap(i)}>
            {t}
          </button>
        ))}
      </div>
    </>
  );
}

/** Put word tiles in the right order to make a sentence. */
export function Order({ step, intro, test, showHi, onDone }: ActProps<OrderStep>) {
  const target = step.sentence.replace(/[.?!,]/g, '').split(/\s+/);
  const [ans, setAns] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setAns([]);
    setMistakes(0);
    setDone(false);
    const t = setTimeout(() => void speakSeq(intro), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  const check = (a: number[]) => {
    const words = a.map((i) => step.tiles[i]);
    if (words.join(' ') === target.join(' ')) {
      sfx.correct();
      setDone(true);
      void speak(step.sentence, 'en', { tone: 'cheer' });
      onDone({ correct: mistakes === 0, assisted: mistakes > 0 });
    } else if (test) {
      setDone(true);
      onDone({ correct: false, assisted: false });
    } else {
      sfx.wrong();
      setShake(true);
      setMistakes((m) => m + 1);
      // keep the correct beginning, return the rest
      let k = 0;
      while (k < words.length && words[k] === target[k]) k++;
      setTimeout(() => {
        setShake(false);
        setAns(a.slice(0, k));
      }, 500);
      void speakSeq(showHi ? [['Try again.', 'en'], ['फिर से कोशिश करो।', 'hi']] : [['Try again.', 'en']], { record: false });
    }
  };

  const add = (i: number) => {
    if (done || ans.includes(i)) return;
    sfx.tap();
    void speak(step.tiles[i]);
    const a = [...ans, i];
    setAns(a);
    if (a.length === target.length) setTimeout(() => check(a), 250);
  };
  const remove = (i: number) => {
    if (done) return;
    setAns(ans.filter((x) => x !== i));
  };

  const need = target[ans.length];
  const hintIdx = !test && mistakes >= 2 && !done ? step.tiles.findIndex((t, i) => t === need && !ans.includes(i)) : -1;

  return (
    <>
      <div className="prompt" style={{ minHeight: 90 }}>
        {step.scene && <Pic e={step.scene} size={92} />}
        {step.hi && showHi && <div className="hi muted" style={{ fontSize: 18 }}>{step.hi}</div>}
        {!test && <Speaker audio={[[step.sentence, 'en']]} size="sm" />}
      </div>
      <div className="slots" style={{ animation: shake ? 'shake .4s' : undefined, borderColor: done ? 'var(--mint)' : undefined }}>
        {ans.map((i) => (
          <button key={i} className="tile word" onClick={() => remove(i)}>
            {step.tiles[i]}
          </button>
        ))}
      </div>
      <div className="tiles">
        {step.tiles.map((t, i) => (
          <button key={i} className={`tile word ${ans.includes(i) ? 'used' : ''} ${hintIdx === i ? 'hint' : ''}`} onClick={() => add(i)}>
            {t}
          </button>
        ))}
      </div>
    </>
  );
}

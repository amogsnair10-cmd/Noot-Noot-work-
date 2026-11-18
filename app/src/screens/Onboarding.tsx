import { useState } from 'react';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { Mascot, Tr, useHindi, useSayOnce } from '../components/ui';
import { sfx } from '../lib/sfx';
import type { Profile } from '../lib/store';
import { newProfile, setState, useAppState } from '../lib/store';

export const AVATARS = ['🦁', '🐯', '🐼', '🦊', '🐨', '🐸', '🐙', '🐬', '🦋', '🐢', '🦄', '🐘', '🚀', '⚽', '🌻', '⭐'];

/** Hand-drawn squiggles that drift in the hero. */
function Scribbles() {
  return (
    <>
      <svg className="scribble" style={{ left: '6%', top: '8%', animationDelay: '-2s' }} width="54" height="54" viewBox="0 0 54 54">
        <path d="M27 5l6 16 17 1-13 11 5 17-15-9-15 9 5-17L4 22l17-1z" />
      </svg>
      <svg className="scribble" style={{ right: '7%', top: '12%', animationDelay: '-4s' }} width="70" height="40" viewBox="0 0 70 40">
        <path d="M4 24c8-14 14 14 22 0s14 14 22 0 10 6 18-6" />
      </svg>
      <svg className="scribble" style={{ left: '10%', top: '46%', animationDelay: '-1s' }} width="46" height="46" viewBox="0 0 46 46">
        <path d="M23 23c0-3 4-3 4 0s-6 4-8-1-1-10 7-10 12 9 8 16-14 9-20 2" />
      </svg>
      <svg className="scribble" style={{ right: '9%', top: '50%', animationDelay: '-5s' }} width="44" height="44" viewBox="0 0 44 44">
        <path d="M6 22h32M26 10l12 12-12 12" />
      </svg>
      <svg className="scribble" style={{ left: '44%', top: '3%', animationDelay: '-3s' }} width="30" height="30" viewBox="0 0 30 30">
        <path d="M15 4v22M4 15h22M8 8l14 14M22 8L8 22" />
      </svg>
    </>
  );
}

export function Welcome({ onStart }: { onStart: () => void }) {
  const hindi = useHindi();
  useSayOnce(
    hindi
      ? [["Hello! I'm Pip. Let's learn English together!", 'en', 'cheer'], ['नमस्ते! चलो साथ में अंग्रेज़ी सीखें!', 'hi']]
      : [["Hello! I'm Pip. Let's learn English together!", 'en', 'cheer']],
  );
  const name = 'Akshar'.split('');
  return (
    <div className="welcome">
      <Scribbles />
      <div className="hero-stage">
        <div className="halo" />
        <div className="ring" />
        <div className="ring r2" />
        <div className="orbit">
          {[
            ['🍎', 0],
            ['🐈', 90],
            ['☀️', 180],
            ['📖', 270],
          ].map(([e, a]) => (
            <div key={e as string} className="it" style={{ transform: `rotate(${a}deg) translateY(calc(var(--stage) * -0.5))` }}>
              <div style={{ transform: `rotate(${-(a as number)}deg)` }}>
                <span>
                  <Pic e={e as string} size={68} />
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="orbit o2">
          {[
            ['🎈', 45],
            ['🌳', 165],
            ['🚌', 285],
          ].map(([e, a]) => (
            <div key={e as string} className="it" style={{ transform: `rotate(${a}deg) translateY(calc(var(--stage) * -0.6))` }}>
              <div style={{ transform: `rotate(${-(a as number)}deg)` }}>
                <span style={{ left: -26, top: -26 }}>
                  <Pic e={e as string} size={52} />
                </span>
              </div>
            </div>
          ))}
        </div>
        <Mascot size={150} mood="wave" level={1} float />
        <span className="glass-letter" style={{ left: '-6%', top: '8%', animationDelay: '-1s' }}>A</span>
        <span className="glass-letter" style={{ right: '-8%', top: '2%', animationDelay: '-3s', width: 60, height: 60 }}>b</span>
        <span className="glass-letter" style={{ left: '-2%', bottom: '8%', animationDelay: '-5s', width: 48, height: 48, fontSize: 26 }}>c</span>
        <span className="glass-letter" style={{ right: '-4%', bottom: '10%', animationDelay: '-2s' }}>1</span>
      </div>

      <div className="title" aria-label="Akshar">
        {name.map((c, i) => (
          <span key={i} style={{ animationDelay: `${0.25 + i * 0.09}s` }}>
            {c}
          </span>
        ))}
      </div>
      <div className="tagline" style={{ textAlign: 'center' }}>
        English, step by step
        {hindi && <span className="hi-tr hi">अंग्रेज़ी, कदम दर कदम</span>}
      </div>

      <div className="glass feat">
        {(
          [
            ['eye', 'See the picture', 'चित्र देखो', 'linear-gradient(135deg,#8b6cff,#5b3fe0)'],
            ['ear', 'Listen and repeat', 'सुनो और दोहराओ', 'linear-gradient(135deg,#22d3ee,#0e9ab8)'],
            ['pencil', 'Read, write and speak', 'पढ़ो, लिखो और बोलो', 'linear-gradient(135deg,#ff6fa8,#d63a7a)'],
          ] as const
        ).map(([ic, en, hi, bg], i) => (
          <div key={en} className="f" style={{ animationDelay: `${1.05 + i * 0.16}s` }}>
            <span className="ic" style={{ background: bg }}>
              <Icon name={ic} size={26} />
            </span>
            <span style={{ flex: 1, textAlign: 'left' }}>
              <b>{en}</b>
              {hindi && <span className="t hi">{hi}</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="cta-wrap">
        <button
          className="btn gold block pulse"
          onClick={() => {
            sfx.pop();
            onStart();
          }}
        >
          <Tr en="Start learning" hi="सीखना शुरू करें" /> <Icon name="next" size={26} stroke={3} />
        </button>
        <div className="muted small" style={{ textAlign: 'center', marginTop: 10 }}>
          Works offline after your first visit
        </div>
      </div>
    </div>
  );
}

export function NewProfile({ onCreated, onBack }: { onCreated: (p: Profile) => void; onBack?: () => void }) {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<Profile['age'] | ''>('');
  const app = useAppState();
  const hindi = useHindi();
  useSayOnce(hindi ? [['Pick your picture.', 'en'], ['अपना चित्र चुनो।', 'hi']] : [['Pick your picture.', 'en']]);

  const create = () => {
    const p = newProfile(name.trim() || `Learner ${app.profiles.length + 1}`, avatar, age || 'child');
    setState((s) => ({ ...s, profiles: [...s.profiles, p], activeId: p.id }));
    onCreated(p);
  };

  return (
    <div className="screen">
      <div className="row">
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon name="back" size={24} stroke={2.8} />
          </button>
        )}
        <Mascot size={62} mood="talk" />
        <h2>
          <Tr en="Who is learning?" hi="कौन सीख रहा है?" />
        </h2>
      </div>

      <div style={{ fontWeight: 800 }}>
        <Tr en="1. Pick your picture" hi="अपना चित्र चुनो" line />
      </div>
      <div className="avatar-grid">
        {AVATARS.map((a) => (
          <button
            key={a}
            className={`avatar ${avatar === a ? 'on' : ''}`}
            aria-label="avatar"
            onClick={() => {
              sfx.pop();
              setAvatar(a);
            }}
          >
            <Pic e={a} size={58} />
          </button>
        ))}
      </div>

      {avatar && (
        <>
          <div style={{ fontWeight: 800 }}>
            <Tr en="2. Your age" hi="आपकी उम्र" line />
          </div>
          <div className="row">
            {(
              [
                ['child', '🧒', 'Child', 'बच्चा'],
                ['teen', '🧑', 'Teen', 'किशोर'],
                ['adult', '🧔', 'Adult', 'बड़े'],
              ] as const
            ).map(([k, e, en, hi]) => (
              <button key={k} className={`avatar ${age === k ? 'on' : ''}`} style={{ flex: 1, aspectRatio: 'auto', padding: '12px 6px', gap: 0 }} onClick={() => setAge(k)}>
                <Pic e={e} size={60} />
                <span style={{ fontWeight: 800, marginTop: 2 }}>
                  <Tr en={en} hi={hi} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {avatar && age && (
        <>
          <div style={{ fontWeight: 800 }}>
            <Tr en="3. Name (optional)" hi="नाम (ज़रूरी नहीं)" line />
          </div>
          <input id="learner-name" className="text-input" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <div className="spacer" />
          <button className="btn block" onClick={create}>
            <Tr en="Next" hi="आगे" /> <Icon name="next" size={24} stroke={3} />
          </button>
        </>
      )}
    </div>
  );
}

export function ProfilePicker({ onPick, onNew, onTeacher }: { onPick: (id: string) => void; onNew: () => void; onTeacher: () => void }) {
  const app = useAppState();
  const hindi = useHindi();
  useSayOnce(hindi ? [['Who is learning? Tap your picture.', 'en'], ['कौन सीख रहा है? अपना चित्र दबाओ।', 'hi']] : [['Who is learning? Tap your picture.', 'en']]);
  return (
    <div className="screen">
      <div className="row">
        <Mascot size={68} mood="wave" float />
        <h2>
          <Tr en="Who is learning?" hi="कौन सीख रहा है?" />
        </h2>
      </div>
      <div className="avatar-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {app.profiles.map((p) => (
          <button key={p.id} className="avatar" style={{ aspectRatio: 'auto', padding: '14px 4px 10px', display: 'flex', flexDirection: 'column', gap: 2 }} onClick={() => onPick(p.id)}>
            <Pic e={p.avatar} size={64} />
            <span style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</span>
          </button>
        ))}
        <button className="avatar" style={{ aspectRatio: 'auto', padding: '14px 4px 10px', display: 'flex', flexDirection: 'column', gap: 2, borderStyle: 'dashed' }} onClick={onNew} aria-label="New learner">
          <Icon name="plus" size={50} stroke={2.2} />
          <span style={{ fontSize: 16, fontWeight: 800 }}>New</span>
        </button>
      </div>
      <div className="spacer" />
      <button className="btn ghost small" onClick={onTeacher}>
        <Icon name="teacher" size={22} /> Teacher
      </button>
    </div>
  );
}

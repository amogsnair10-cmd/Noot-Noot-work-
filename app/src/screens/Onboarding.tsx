import { useState } from 'react';
import { Mascot, useSayOnce } from '../components/ui';
import { sfx } from '../lib/sfx';
import { speak } from '../lib/speech';
import type { Profile } from '../lib/store';
import { newProfile, setState, useAppState } from '../lib/store';

export const AVATARS = ['🦁', '🐯', '🐼', '🦊', '🐨', '🐸', '🦉', '🐬', '🦋', '🐢', '🦚', '🐘', '🚀', '⚽', '🌻', '⭐'];

export function Welcome({ onStart }: { onStart: () => void }) {
  useSayOnce([
    ['नमस्ते! मैं मित्र हूँ।', 'hi'],
    ['चलो, मज़े से इंग्लिश सीखें!', 'hi'],
    ['Hello! Let us learn English.', 'en'],
  ]);
  return (
    <div className="screen center" style={{ gap: 22 }}>
      <div style={{ animation: 'hop 1.2s ease infinite' }}>
        <Mascot size={170} mood="happy" />
      </div>
      <div>
        <h1 style={{ fontSize: 40 }}>Akshar English</h1>
        <div className="hi" style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal-dark)' }}>
          चलो, मज़े से इंग्लिश सीखें!
        </div>
        <div className="muted">Learn English step by step — with Hindi help</div>
      </div>
      <div className="card" style={{ width: '100%', textAlign: 'left' }}>
        {[
          ['👀', 'चित्र देखो', 'See pictures'],
          ['👂', 'सुनो और बोलो', 'Listen and speak'],
          ['📖', 'पढ़ो और लिखो', 'Read and write'],
          ['🏆', 'हर दिन आगे बढ़ो', 'Grow every day'],
        ].map(([e, hi, en]) => (
          <div key={en} className="row" style={{ padding: '6px 0' }}>
            <span style={{ fontSize: 32 }}>{e}</span>
            <span className="hi" style={{ fontWeight: 700, fontSize: 20 }}>{hi}</span>
            <span className="muted small">· {en}</span>
          </div>
        ))}
      </div>
      <button
        className="btn block"
        onClick={() => {
          sfx.tap();
          onStart();
        }}
      >
        शुरू करो · Start ▶
      </button>
    </div>
  );
}

export function NewProfile({ onCreated, onBack }: { onCreated: (p: Profile) => void; onBack?: () => void }) {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<Profile['age'] | ''>('');
  const app = useAppState();
  useSayOnce([['अपना चित्र चुनो', 'hi']]);

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
            ←
          </button>
        )}
        <Mascot size={56} mood="talk" />
        <div>
          <h2 className="hi">तुम कौन हो?</h2>
          <div className="muted">Who is learning?</div>
        </div>
      </div>

      <div className="hi" style={{ fontWeight: 700 }}>1. अपना चित्र चुनो · Pick your picture</div>
      <div className="avatar-grid">
        {AVATARS.map((a) => (
          <button
            key={a}
            className={`avatar ${avatar === a ? 'on' : ''}`}
            onClick={() => {
              sfx.tap();
              setAvatar(a);
              if (!age) void speak('तुम बच्चे हो या बड़े?', 'hi');
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {avatar && (
        <>
          <div className="hi" style={{ fontWeight: 700 }}>2. तुम्हारी उम्र · Your age</div>
          <div className="row">
            {(
              [
                ['child', '🧒', 'बच्चा', 'Child'],
                ['teen', '🧑', 'किशोर', 'Teen'],
                ['adult', '🧔', 'बड़े', 'Adult'],
              ] as const
            ).map(([k, e, hi, en]) => (
              <button key={k} className={`avatar ${age === k ? 'on' : ''}`} style={{ flex: 1, aspectRatio: 'auto', padding: 10, fontSize: 18 }} onClick={() => setAge(k)}>
                <span style={{ fontSize: 40 }}>{e}</span>
                <span className="hi" style={{ fontWeight: 700 }}>{hi}</span>
                <span className="small muted">{en}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {avatar && age && (
        <>
          <div className="hi" style={{ fontWeight: 700 }}>3. नाम (ज़रूरी नहीं) · Name (optional)</div>
          <input className="text-input" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="Name / नाम" />
          <div className="spacer" />
          <button className="btn block" onClick={create}>
            आगे · Next ▶
          </button>
        </>
      )}
    </div>
  );
}

export function ProfilePicker({ onPick, onNew, onTeacher }: { onPick: (id: string) => void; onNew: () => void; onTeacher: () => void }) {
  const app = useAppState();
  useSayOnce([['तुम कौन हो? अपना चित्र दबाओ', 'hi']]);
  return (
    <div className="screen">
      <div className="row">
        <Mascot size={60} mood="happy" />
        <div>
          <h2 className="hi">तुम कौन हो?</h2>
          <div className="muted">Tap your picture</div>
        </div>
      </div>
      <div className="avatar-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {app.profiles.map((p) => (
          <button key={p.id} className="avatar" style={{ aspectRatio: 'auto', padding: '12px 4px', display: 'flex', flexDirection: 'column' }} onClick={() => onPick(p.id)}>
            <span style={{ fontSize: 50 }}>{p.avatar}</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
          </button>
        ))}
        <button className="avatar" style={{ aspectRatio: 'auto', padding: '12px 4px', display: 'flex', flexDirection: 'column', borderStyle: 'dashed' }} onClick={onNew}>
          <span style={{ fontSize: 50 }}>➕</span>
          <span className="hi" style={{ fontSize: 16, fontWeight: 700 }}>नया</span>
        </button>
      </div>
      <div className="spacer" />
      <button className="btn ghost small" onClick={onTeacher}>
        🧑‍🏫 Teacher
      </button>
    </div>
  );
}

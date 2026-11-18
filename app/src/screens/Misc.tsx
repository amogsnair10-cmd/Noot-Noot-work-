import { useEffect, useState } from 'react';
import { LEVELS } from '../content/curriculum';
import { wordLabel } from '../content/words';
import { Confetti, Mascot, Stars, useSayOnce } from '../components/ui';
import type { LessonOutcome } from '../lib/engine';
import { dueItems, weakItems } from '../lib/engine';
import { sfx } from '../lib/sfx';
import type { Profile, Settings } from '../lib/store';
import { setState, useAppState } from '../lib/store';

export type Tab = 'home' | 'practice' | 'progress' | 'more';

export function Nav({ tab, onTab, due }: { tab: Tab; onTab: (t: Tab) => void; due: number }) {
  const items: Array<[Tab, string, string]> = [
    ['home', '🏠', 'सीखो'],
    ['practice', '🔁', 'दोहराओ'],
    ['progress', '📊', 'प्रगति'],
    ['more', '⚙️', 'और'],
  ];
  return (
    <nav className="nav">
      {items.map(([k, ico, hi]) => (
        <button
          key={k}
          className={tab === k ? 'on' : ''}
          onClick={() => {
            sfx.tap();
            onTab(k);
          }}
        >
          <span className="ico">{ico}</span>
          <span className="hi">{hi}</span>
          {k === 'practice' && due > 0 && <span className="badge">{due}</span>}
        </button>
      ))}
    </nav>
  );
}

export function LessonDone({ outcome, title, showHi, onNext, onHome, onRetry }: { outcome: LessonOutcome; title: string; showHi: boolean; onNext: () => void; onHome: () => void; onRetry: () => void }) {
  const { passed, stars, accuracy, levelUp, newWords } = outcome;
  useEffect(() => {
    if (levelUp) sfx.levelUp();
    else if (passed) sfx.celebrate();
  }, [passed, levelUp]);
  useSayOnce(
    levelUp
      ? [[showHi ? `वाह! तुम लेवल ${levelUp} पर पहुँच गए!` : `Wow! You reached level ${levelUp}!`, showHi ? 'hi' : 'en']]
      : passed
        ? [[showHi ? 'पाठ पूरा हुआ! बहुत बढ़िया!' : 'Lesson complete! Great work!', showHi ? 'hi' : 'en']]
        : [[showHi ? 'अच्छी कोशिश! थोड़ा और अभ्यास करते हैं। तुम कर सकते हो!' : "Good try! Let's practise a bit more. You can do it!", showHi ? 'hi' : 'en']],
  );
  const L = levelUp ? LEVELS[levelUp - 1] : null;
  return (
    <div className="screen center" style={{ gap: 16 }}>
      <Confetti run={passed} />
      <Mascot size={130} mood={passed ? 'happy' : 'think'} />
      {L ? (
        <div className="card col" style={{ width: '100%', alignItems: 'center', borderColor: L.color, borderWidth: 3 }}>
          <div style={{ fontSize: 64, animation: 'pop .6s' }}>{L.emoji}</div>
          <h1 style={{ color: L.color }}>Level up!</h1>
          <div className="hi" style={{ fontSize: 22, fontWeight: 800 }}>
            लेवल {L.n}: {L.nameHi}
          </div>
          <div className="muted">
            Level {L.n}: {L.name} — {L.stage}
          </div>
        </div>
      ) : (
        <>
          <h1 className="hi">{passed ? (showHi ? 'पाठ पूरा! 🎉' : 'Lesson complete! 🎉') : showHi ? 'अच्छी कोशिश! 💪' : 'Good try! 💪'}</h1>
          <div className="muted">{title}</div>
        </>
      )}
      {passed && <Stars n={stars} size={48} />}
      <div className="row" style={{ gap: 8, width: '100%' }}>
        <div className="stat">
          <div className="n" style={{ color: passed ? 'var(--good)' : 'var(--try)' }}>{accuracy}%</div>
          <div className="t hi">पहली बार सही · first try</div>
        </div>
        <div className="stat">
          <div className="n">{newWords.length}</div>
          <div className="t hi">नए · new</div>
        </div>
      </div>
      {!passed && (
        <div className="card hi" style={{ width: '100%', textAlign: 'left' }}>
          🎯 {showHi ? 'अगला पाठ खोलने के लिए जाँच में 70% सही करना है। हम फिर से अभ्यास करेंगे — इस बार ज़्यादा मदद के साथ।' : 'Get 70% in the check to open the next lesson. Practise again — with more help this time.'}
        </div>
      )}
      {newWords.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {newWords.slice(0, 12).map((k) => {
            const w = wordLabel(k);
            return w ? (
              <span key={k} className="chip" style={{ animation: 'pop .4s' }}>
                {w.emoji} {w.en}
              </span>
            ) : null;
          })}
        </div>
      )}
      <div className="spacer" />
      {passed ? (
        <button className="btn block good" onClick={onNext}>
          {showHi ? 'अगला पाठ' : 'Next lesson'} ▶
        </button>
      ) : (
        <button className="btn block" onClick={onRetry}>
          🔁 {showHi ? 'फिर से करो' : 'Try again'}
        </button>
      )}
      <button className="btn ghost block" onClick={onHome}>
        🏠 {showHi ? 'होम' : 'Home'}
      </button>
    </div>
  );
}

export function PracticeTab({ p, onPractice }: { p: Profile; onPractice: (keys: string[]) => void }) {
  const due = dueItems(p, 12);
  const weak = weakItems(p, 12);
  const showHi = p.level <= 2;
  return (
    <div className="screen with-nav">
      <div className="row">
        <Mascot size={64} mood="talk" />
        <div>
          <h2 className="hi">दोहराओ · Practice</h2>
          <div className="muted small">{showHi ? 'जो सीखा उसे पक्का करो' : 'Make what you learned stick'}</div>
        </div>
      </div>
      <div className="card col" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🧠</div>
        <h2>{due.length}</h2>
        <div className="hi" style={{ fontWeight: 700 }}>आज दोहराने वाले शब्द</div>
        <div className="muted small">Words to review today — practising at the right time helps you remember for longer.</div>
        <button className="btn teal block" disabled={!due.length} onClick={() => onPractice(due)}>
          🔁 {showHi ? 'अभी दोहराओ' : 'Review now'}
        </button>
      </div>
      {weak.length > 0 && (
        <div className="card col">
          <div className="hi" style={{ fontWeight: 800 }}>💪 मुश्किल शब्द · Tricky words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {weak.map((k) => {
              const w = wordLabel(k);
              return w ? (
                <span key={k} className="chip">
                  {w.emoji} {w.en}
                </span>
              ) : null;
            })}
          </div>
          <button className="btn ghost block" onClick={() => onPractice(weak)}>
            {showHi ? 'मुश्किल शब्दों का अभ्यास' : 'Practise tricky words'}
          </button>
        </div>
      )}
      {!due.length && !weak.length && (
        <div className="card hi" style={{ textAlign: 'center' }}>
          {showHi ? 'अभी दोहराने के लिए कुछ नहीं। पहले कुछ पाठ करो! 🌱' : 'Nothing to review yet. Do some lessons first! 🌱'}
        </div>
      )}
    </div>
  );
}

export function RestScreen({ settings, onHome }: { settings: Settings; onHome: () => void }) {
  useSayOnce([['आज बहुत अच्छा काम किया! अब आराम करो, कल फिर मिलते हैं।', 'hi']]);
  return (
    <div className="screen center" style={{ gap: 18 }}>
      <div style={{ fontSize: 90 }}>🌙</div>
      <Mascot size={110} mood="happy" />
      <h1 className="hi">आज के लिए बहुत हुआ!</h1>
      <div className="muted">
        You've learned for {settings.dailyLimitMin} minutes today. Rest your eyes — your brain keeps learning while you rest. See you tomorrow!
      </div>
      <button className="btn block teal" onClick={onHome}>
        🏠 OK
      </button>
    </div>
  );
}

export function MoreTab({ p, onSwitch, onTeacher, installPrompt }: { p: Profile; onSwitch: () => void; onTeacher: () => void; installPrompt: (() => void) | null }) {
  const app = useAppState();
  const s = app.settings;
  const set = (patch: Partial<Settings>) => setState((st) => ({ ...st, settings: { ...st.settings, ...patch } }));
  const [renaming, setRenaming] = useState(false);
  return (
    <div className="screen with-nav">
      <h2 className="hi">और · More</h2>
      <div className="card row">
        <span style={{ fontSize: 46 }}>{p.avatar}</span>
        <div style={{ flex: 1 }}>
          {renaming ? (
            <input
              className="text-input"
              defaultValue={p.name}
              autoFocus
              maxLength={20}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v) setState((st) => ({ ...st, profiles: st.profiles.map((x) => (x.id === p.id ? { ...x, name: v } : x)) }));
                setRenaming(false);
              }}
            />
          ) : (
            <button style={{ fontWeight: 800, fontSize: 22 }} onClick={() => setRenaming(true)}>
              {p.name} ✏️
            </button>
          )}
        </div>
      </div>
      <button className="btn ghost block" onClick={onSwitch}>
        {'👥 दूसरा सीखने वाला · Switch learner'}
      </button>
      {installPrompt && (
        <button className="btn teal block" onClick={installPrompt}>
          {'📲 फ़ोन पर ऐप लगाओ · Install app'}
        </button>
      )}
      <div className="card col">
        <Toggle on={s.slowSpeech} onChange={(v) => set({ slowSpeech: v })} label="🐢 धीमी आवाज़ · Slow voice" />
        <Toggle on={s.sound} onChange={(v) => set({ sound: v })} label="🔔 आवाज़ें · Sound effects" />
      </div>
      <button className="btn ghost block" onClick={onTeacher}>
        🧑‍🏫 Teacher area
      </button>
      <div className="muted small" style={{ textAlign: 'center' }}>
        Akshar English · works offline after the first visit · your progress stays on this phone
      </div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className="row" style={{ justifyContent: 'space-between', padding: '6px 0' }} onClick={() => onChange(!on)}>
      <span className="hi" style={{ fontWeight: 700 }}>{label}</span>
      <span style={{ width: 58, height: 34, borderRadius: 17, background: on ? 'var(--good)' : '#d8d3c8', position: 'relative', transition: 'background .2s', flex: 'none' }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 27 : 3, width: 28, height: 28, borderRadius: 14, background: '#fff', transition: 'left .2s' }} />
      </span>
    </button>
  );
}

export function useInstallPrompt() {
  const [evt, setEvt] = useState<(Event & { prompt: () => Promise<void> }) | null>(null);
  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setEvt(e as Event & { prompt: () => Promise<void> });
    };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  return evt
    ? () => {
        void evt.prompt();
        setEvt(null);
      }
    : null;
}

import { useEffect, useState } from 'react';
import { LEVELS } from '../content/curriculum';
import { wordLabel } from '../content/words';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import type { IconName } from '../components/Icon';
import { Confetti, Mascot, Stars, Tr, useHindi, useSayOnce } from '../components/ui';
import type { LessonOutcome } from '../lib/engine';
import { dueItems, weakItems } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { setReplay } from '../lib/speech';
import type { Profile, Settings } from '../lib/store';
import { setState, useAppState } from '../lib/store';

export type Tab = 'home' | 'practice' | 'progress' | 'more';

export function Nav({ tab, onTab, due }: { tab: Tab; onTab: (t: Tab) => void; due: number }) {
  const items: Array<[Tab, IconName, string]> = [
    ['home', 'home', 'Learn'],
    ['practice', 'repeat', 'Practice'],
    ['progress', 'chart', 'Progress'],
    ['more', 'gear', 'More'],
  ];
  return (
    <nav className="nav" aria-label="Main">
      {items.map(([k, ic, label]) => (
        <button
          key={k}
          className={tab === k ? 'on' : ''}
          onClick={() => {
            sfx.tap();
            onTab(k);
          }}
        >
          <Icon name={ic} size={26} />
          <span>{label}</span>
          {k === 'practice' && due > 0 && <span className="badge">{due}</span>}
        </button>
      ))}
    </nav>
  );
}

export function LessonDone({ outcome, title, level, onNext, onHome, onRetry }: { outcome: LessonOutcome; title: string; level: number; onNext: () => void; onHome: () => void; onRetry: () => void }) {
  const { passed, stars, accuracy, levelUp, newWords } = outcome;
  const hindi = useHindi();
  useEffect(() => {
    if (levelUp) sfx.levelUp();
    else if (passed) sfx.celebrate();
    for (let i = 0; i < stars; i++) setTimeout(() => sfx.star(i), 700 + i * 260);
  }, [passed, levelUp, stars]);
  const en = levelUp ? `Wow! You reached level ${levelUp}!` : passed ? 'Lesson complete! Great work!' : "Good try! Let's practise a bit more. You can do it!";
  const hi = levelUp ? `वाह! तुम लेवल ${levelUp} पर पहुँच गए!` : passed ? 'पाठ पूरा हुआ! बहुत बढ़िया!' : 'अच्छी कोशिश! थोड़ा और अभ्यास करते हैं। तुम कर सकते हो!';
  useSayOnce(hindi ? [[en, 'en', 'cheer'], [hi, 'hi']] : [[en, 'en', 'cheer']]);
  const L = levelUp ? LEVELS[levelUp - 1] : null;
  return (
    <div className="screen center" style={{ gap: 16 }}>
      <Confetti run={passed} />
      <Mascot size={140} mood={passed ? 'happy' : 'think'} level={levelUp ?? level} float />
      {L ? (
        <div className="glass tint col" style={{ ['--tint' as string]: L.color, width: '100%', alignItems: 'center', padding: 20, gap: 4 }}>
          <Pic e={L.emoji} size={76} />
          <h1 style={{ color: L.color }}>Level up!</h1>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            Level {L.n}: {L.name}
          </div>
          <div className="muted">{L.stage}</div>
        </div>
      ) : (
        <>
          <h1>
            <Tr en={passed ? 'Lesson complete!' : 'Good try!'} hi={passed ? 'पाठ पूरा!' : 'अच्छी कोशिश!'} />
          </h1>
          <div className="muted">{title}</div>
        </>
      )}
      {passed && <Stars n={stars} size={52} />}
      <div className="row" style={{ gap: 8, width: '100%' }}>
        <div className="stat">
          <div className="n" style={{ color: passed ? 'var(--mint)' : 'var(--amber)' }}>
            {accuracy}%
          </div>
          <div className="t"><Tr en="First try" hi="पहली बार सही" /></div>
        </div>
        <div className="stat">
          <div className="n">{newWords.length}</div>
          <div className="t"><Tr en="New" hi="नए" /></div>
        </div>
      </div>
      {!passed && (
        <div className="glass" style={{ width: '100%', textAlign: 'left', padding: 16 }}>
          <Tr en="Get 70% in the check to open the next lesson. We will practise again with more help." hi="अगला पाठ खोलने के लिए जाँच में 70% सही करना है। हम ज़्यादा मदद के साथ फिर अभ्यास करेंगे।" />
        </div>
      )}
      {newWords.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {newWords.slice(0, 12).map((k) => {
            const w = wordLabel(k);
            return w ? (
              <span key={k} className="chip" style={{ animation: 'pop .4s' }}>
                <Pic e={w.emoji} size={26} flat /> {w.en}
              </span>
            ) : null;
          })}
        </div>
      )}
      <div className="spacer" />
      {passed ? (
        <button className="btn block good" onClick={onNext}>
          <Tr en="Next lesson" hi="अगला पाठ" /> <Icon name="next" size={24} stroke={3} />
        </button>
      ) : (
        <button className="btn block gold" onClick={onRetry}>
          <Icon name="repeat" size={24} /> <Tr en="Try again" hi="फिर से करो" />
        </button>
      )}
      <button className="btn ghost block" onClick={onHome}>
        <Icon name="home" size={24} /> <Tr en="Home" hi="होम" />
      </button>
    </div>
  );
}

export function PracticeTab({ p, onPractice }: { p: Profile; onPractice: (keys: string[]) => void }) {
  const due = dueItems(p, 12);
  const weak = weakItems(p, 12);
  const hindi = useHindi();
  useSayOnce(hindi ? [['Practice makes it stick. Review your words today!', 'en'], ['अभ्यास से याद पक्का होता है। आज अपने शब्द दोहराओ!', 'hi']] : [['Practice makes it stick. Review your words today!', 'en']]);
  return (
    <div className="screen with-nav">
      <div className="row">
        <Mascot size={70} mood="talk" level={p.level} float />
        <div>
          <h2>
            <Tr en="Practice" hi="दोहराओ" />
          </h2>
          <div className="muted small">Make what you learned stick</div>
        </div>
      </div>
      <div className="glass col" style={{ alignItems: 'center', textAlign: 'center', padding: 22 }}>
        <Icon name="brain" size={54} style={{ color: 'var(--violet-2)' }} />
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1 }}>{due.length}</div>
        <div style={{ fontWeight: 800 }}>
          <Tr en="Words to review today" hi="आज दोहराने वाले शब्द" />
        </div>
        <div className="muted small">Reviewing at the right time helps you remember for longer.</div>
        <button className="btn cyan block" disabled={!due.length} onClick={() => onPractice(due)}>
          <Icon name="repeat" size={24} /> <Tr en="Review now" hi="अभी दोहराओ" />
        </button>
      </div>
      {weak.length > 0 && (
        <div className="glass col">
          <div style={{ fontWeight: 800 }}>
            <Tr en="Tricky words" hi="मुश्किल शब्द" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {weak.map((k) => {
              const w = wordLabel(k);
              return w ? (
                <span key={k} className="chip">
                  <Pic e={w.emoji} size={26} flat /> {w.en}
                </span>
              ) : null;
            })}
          </div>
          <button className="btn ghost block" onClick={() => onPractice(weak)}>
            <Tr en="Practise tricky words" hi="मुश्किल शब्दों का अभ्यास" />
          </button>
        </div>
      )}
      {!due.length && !weak.length && (
        <div className="glass" style={{ textAlign: 'center' }}>
          <Tr en="Nothing to review yet. Do some lessons first!" hi="अभी दोहराने के लिए कुछ नहीं। पहले कुछ पाठ करो!" />
        </div>
      )}
    </div>
  );
}

export function RestScreen({ settings, onHome }: { settings: Settings; onHome: () => void }) {
  const hindi = useHindi();
  const en = "That's enough for today. Rest your eyes. See you tomorrow!";
  useSayOnce(hindi ? [[en, 'en'], ['आज के लिए बहुत हुआ। आराम करो, कल फिर मिलते हैं!', 'hi']] : [[en, 'en']]);
  return (
    <div className="screen center" style={{ gap: 18 }}>
      <Pic e="🌙" size={100} />
      <Mascot size={120} mood="happy" float />
      <h1>
        <Tr en="Time to rest!" hi="आज के लिए बहुत हुआ!" />
      </h1>
      <div className="muted">You have learned for {settings.dailyLimitMin} minutes today. Your brain keeps learning while you rest.</div>
      <button className="btn block cyan" onClick={onHome}>
        <Icon name="home" size={24} /> OK
      </button>
    </div>
  );
}

export function MoreTab({ p, onSwitch, onTeacher, installPrompt }: { p: Profile; onSwitch: () => void; onTeacher: () => void; installPrompt: (() => void) | null }) {
  const app = useAppState();
  const s = app.settings;
  const set = (patch: Partial<Settings>) => setState((st) => ({ ...st, settings: { ...st.settings, ...patch } }));
  const [renaming, setRenaming] = useState(false);
  useEffect(() => setReplay([['Settings. Here you can change how the app talks and shows Hindi.', 'en']]), []);
  return (
    <div className="screen with-nav">
      <h2>
        <Tr en="More" hi="और" />
      </h2>
      <div className="glass row">
        <Pic e={p.avatar} size={60} />
        <div style={{ flex: 1 }}>
          {renaming ? (
            <input
              id="rename"
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
            <button style={{ fontWeight: 800, fontSize: 24, display: 'inline-flex', gap: 8, alignItems: 'center' }} onClick={() => setRenaming(true)}>
              {p.name} <Icon name="pencil" size={20} />
            </button>
          )}
          <div className="muted small">Level {p.level}: {LEVELS[p.level - 1].name}</div>
        </div>
      </div>

      <div className="glass col">
        <div className="row">
          <Icon name="translate" size={26} style={{ color: 'var(--cyan)' }} />
          <div style={{ fontWeight: 800 }}>Hindi translation</div>
        </div>
        <div className="seg" role="group" aria-label="Hindi translation">
          {(
            [
              ['auto', 'Auto'],
              ['always', 'Always'],
              ['off', 'Off'],
            ] as const
          ).map(([k, label]) => (
            <button key={k} className={s.hindi === k ? 'on' : ''} onClick={() => set({ hindi: k })}>
              {label}
            </button>
          ))}
        </div>
        <div className="muted small">Hindi appears only as a small translation under the English. Auto shows it in Levels 1 and 2.</div>
        <Toggle on={s.slowSpeech} onChange={(v) => set({ slowSpeech: v })} icon="turtle" label="Slow voice" />
        <Toggle on={s.sound} onChange={(v) => set({ sound: v })} icon="sound" label="Sound effects" />
      </div>

      <button className="btn ghost block" onClick={onSwitch}>
        <Icon name="user" size={24} /> Switch learner
      </button>
      {installPrompt && (
        <button className="btn cyan block" onClick={installPrompt}>
          <Icon name="download" size={24} /> <Tr en="Install app on this phone" hi="फ़ोन पर ऐप लगाओ" />
        </button>
      )}
      <button className="btn ghost block" onClick={onTeacher}>
        <Icon name="teacher" size={24} /> Teacher area
      </button>
      <div className="muted small" style={{ textAlign: 'center' }}>
        Akshar English · works offline after the first visit · your progress stays on this phone
      </div>
    </div>
  );
}

function Toggle({ on, onChange, label, icon }: { on: boolean; onChange: (v: boolean) => void; label: string; icon: IconName }) {
  return (
    <button className="row" style={{ justifyContent: 'space-between', padding: '4px 0' }} onClick={() => onChange(!on)} role="switch" aria-checked={on}>
      <span className="row" style={{ fontWeight: 700 }}>
        <Icon name={icon} size={24} style={{ color: 'var(--ink-2)' }} /> {label}
      </span>
      <span className={`toggle ${on ? 'on' : ''}`}>
        <i />
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

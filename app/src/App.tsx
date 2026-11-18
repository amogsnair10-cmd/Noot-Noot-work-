import { useEffect, useState } from 'react';
import { LESSON_MAP } from './content/curriculum';
import type { Lesson } from './content/types';
import type { LessonOutcome, Step } from './lib/engine';
import { applyResults, dueItems, generateLesson, isEasyMode, nextLesson, reviewStep, shuffle } from './lib/engine';
import { ReplayButton, Sky } from './components/ui';
import { shareText, textReport } from './lib/report';
import { setMuted } from './lib/sfx';
import { setSlowSpeech } from './lib/speech';
import type { Profile } from './lib/store';
import { activeProfile, getState, setState, today, updateProfile, useAppState } from './lib/store';
import { Home } from './screens/Home';
import type { Tab } from './screens/Misc';
import { LessonDone, MoreTab, Nav, PracticeTab, RestScreen, useInstallPrompt } from './screens/Misc';
import { NewProfile, ProfilePicker, Welcome } from './screens/Onboarding';
import type { Session } from './screens/Player';
import { Player } from './screens/Player';
import { Progress } from './screens/Progress';
import { Teacher } from './screens/Teacher';
import { TestFlow } from './screens/TestFlow';

type View =
  | { v: 'welcome' }
  | { v: 'new' }
  | { v: 'pick' }
  | { v: 'main'; tab: Tab }
  | { v: 'test'; form: 'A' | 'B' }
  | { v: 'retention'; steps: Step[] }
  | { v: 'play'; session: Session }
  | { v: 'done'; outcome: LessonOutcome; session: Session }
  | { v: 'rest' }
  | { v: 'teacher' };

const RESUME = (id: string) => `akshar-resume-${id}`;

function loadResume(id: string): Session | null {
  try {
    const raw = localStorage.getItem(RESUME(id));
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function saveResume(id: string, s: Session | null) {
  try {
    if (s && s.kind !== 'practice') localStorage.setItem(RESUME(id), JSON.stringify(s));
    else localStorage.removeItem(RESUME(id));
  } catch {
    /* ignore */
  }
}

function initialView(): View {
  const s = getState();
  if (!s.profiles.length) return { v: 'welcome' };
  const p = activeProfile(s);
  if (!p) return { v: 'pick' };
  if (!p.placement) return { v: 'test', form: 'A' };
  return { v: 'main', tab: 'home' };
}

export default function App() {
  const app = useAppState();
  const [view, setView] = useState<View>(initialView);
  const p = activeProfile(app);
  const install = useInstallPrompt();
  const [toast, setToast] = useState('');

  useEffect(() => {
    setSlowSpeech(app.settings.slowSpeech);
    setMuted(!app.settings.sound);
  }, [app.settings.slowSpeech, app.settings.sound]);

  const viewKey = view.v + ('tab' in view ? view.tab : '');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const overLimit = (x: Profile) => (x.daily[today()]?.sec ?? 0) >= app.settings.dailyLimitMin * 60 && x.extraTimeDate !== today();

  const startLesson = (x: Profile, l: Lesson) => {
    if (overLimit(x)) return setView({ v: 'rest' });
    const steps = generateLesson(x, l);
    const session: Session = { id: `${l.id}-${Date.now()}`, kind: l.kind === 'checkpoint' ? 'checkpoint' : 'lesson', lessonId: l.id, title: l.title, level: l.level, easy: isEasyMode(x, l), steps, index: 0, results: [], seconds: 0, writings: [] };
    saveResume(x.id, null);
    setView({ v: 'play', session });
  };

  const startPractice = (x: Profile, keys: string[]) => {
    if (overLimit(x)) return setView({ v: 'rest' });
    const steps = shuffle(keys)
      .map((k) => reviewStep(k, x.level, 'check', x.level === 1 ? 3 : 4))
      .filter(Boolean) as Step[];
    if (!steps.length) return;
    setView({ v: 'play', session: { id: `practice-${Date.now()}`, kind: 'practice', title: 'Practice', level: x.level, easy: false, steps, index: 0, results: [], seconds: 0, writings: [] } });
  };

  const finishSession = (x: Profile, s: Session) => {
    const lesson = s.lessonId ? LESSON_MAP[s.lessonId] : null;
    const { profile, outcome } = applyResults(x, lesson, s.results, s.seconds);
    const writings = [...profile.writings, ...s.writings.map((w) => ({ ...w, date: today() }))];
    updateProfile(x.id, () => ({ ...profile, writings }));
    saveResume(x.id, null);
    setView({ v: 'done', outcome: s.kind === 'practice' ? { ...outcome, passed: true } : outcome, session: s });
  };

  // ------------------------------------------------------------ views without a learner
  if (view.v === 'welcome') return <Shell replay><Welcome onStart={() => setView({ v: 'new' })} /></Shell>;
  if (view.v === 'new')
    return (
      <Shell replay>
        <NewProfile onBack={app.profiles.length ? () => setView({ v: 'pick' }) : undefined} onCreated={() => setView({ v: 'test', form: 'A' })} />
      </Shell>
    );
  if (view.v === 'teacher')
    return (
      <Shell>
        <Teacher
          onExit={() => setView(p ? { v: 'main', tab: 'more' } : { v: 'pick' })}
          onRunFinal={(id) => {
            setState((st) => ({ ...st, activeId: id }));
            setView({ v: 'test', form: 'B' });
          }}
        />
      </Shell>
    );
  if (view.v === 'pick' || !p)
    return (
      <Shell replay>
        <ProfilePicker
          onPick={(id) => {
            setState((st) => ({ ...st, activeId: id }));
            const np = getState().profiles.find((x) => x.id === id)!;
            setView(np.placement ? { v: 'main', tab: 'home' } : { v: 'test', form: 'A' });
          }}
          onNew={() => setView({ v: 'new' })}
          onTeacher={() => setView({ v: 'teacher' })}
        />
      </Shell>
    );

  // ------------------------------------------------------------ learner views
  if (view.v === 'test')
    return (
      <Shell>
        <TestFlow
          key={view.form + p.id}
          profile={p}
          form={view.form}
          onQuit={() => setView(p.placement ? { v: 'main', tab: 'progress' } : { v: 'pick' })}
          onDone={(r) => {
            if (view.form === 'A') updateProfile(p.id, (x) => ({ ...x, placement: r, level: r.level, startLevel: r.level }));
            else updateProfile(p.id, (x) => ({ ...x, endline: r }));
            setView({ v: 'main', tab: view.form === 'A' ? 'home' : 'progress' });
          }}
        />
      </Shell>
    );

  if (view.v === 'retention')
    return (
      <Shell>
        <Player
          test
          session={{ id: 'retention', kind: 'practice', title: 'Memory check', level: p.level, easy: false, steps: view.steps, index: 0, results: [], seconds: 0, writings: [] }}
          onQuit={() => setView({ v: 'main', tab: 'progress' })}
          onFinish={(s) => {
            const sc = s.results.filter((r) => r.scored);
            updateProfile(p.id, (x) => ({ ...x, retention: { date: today(), right: sc.filter((r) => r.correct).length, total: sc.length || 1 } }));
            setView({ v: 'main', tab: 'progress' });
            setToast('🧠 Saved!');
          }}
        />
      </Shell>
    );

  if (view.v === 'play')
    return (
      <Shell>
        <Player
          key={view.session.id}
          session={view.session}
          onProgress={(s) => saveResume(p.id, s.index > 0 ? s : null)}
          onFinish={(s) => finishSession(p, s)}
          onQuit={(s) => {
            saveResume(p.id, s.index > 0 ? s : null);
            if (s.seconds > 0) updateProfile(p.id, (x) => ({ ...x, daily: { ...x.daily, [today()]: { sec: (x.daily[today()]?.sec ?? 0) + s.seconds, lessons: x.daily[today()]?.lessons ?? 0 } } }));
            setView({ v: 'main', tab: 'home' });
          }}
        />
      </Shell>
    );

  if (view.v === 'done') {
    const lesson = view.session.lessonId ? LESSON_MAP[view.session.lessonId] : null;
    return (
      <Shell replay>
        <LessonDone
          outcome={view.outcome}
          title={view.session.title}
          level={p.level}
          onHome={() => setView({ v: 'main', tab: 'home' })}
          onRetry={() => (lesson ? startLesson(p, lesson) : setView({ v: 'main', tab: 'practice' }))}
          onNext={() => {
            const n = nextLesson(p);
            if (n && view.session.kind !== 'practice') startLesson(p, n);
            else setView({ v: 'main', tab: 'home' });
          }}
        />
      </Shell>
    );
  }

  if (view.v === 'rest') return <Shell replay><RestScreen settings={app.settings} onHome={() => setView({ v: 'main', tab: 'home' })} /></Shell>;

  // main tabs
  const resume = loadResume(p.id);
  const tab = view.tab;
  return (
    <Shell>
      {tab === 'home' && (
        <Home
          p={p}
          settings={app.settings}
          resume={resume ? { lessonId: resume.lessonId, title: resume.title, index: resume.index, total: resume.steps.length } : null}
          onStart={(l) => startLesson(p, l)}
          onResume={() => (overLimit(p) ? setView({ v: 'rest' }) : setView({ v: 'play', session: { ...resume!, seconds: 0 } }))}
          onSwitch={() => setView({ v: 'pick' })}
        />
      )}
      {tab === 'practice' && <PracticeTab p={p} onPractice={(keys) => startPractice(p, keys)} />}
      {tab === 'progress' && (
        <Progress
          p={p}
          onFinalTest={() => setView({ v: 'test', form: 'B' })}
          onRetention={() => {
            const keys = shuffle(Object.entries(p.items).filter(([, s]) => s.right > 0).map(([k]) => k)).slice(0, 15);
            const steps = keys.map((k) => reviewStep(k, p.level, 'check', 3)).filter(Boolean) as Step[];
            if (steps.length) setView({ v: 'retention', steps });
          }}
          onShare={async () => {
            const r = await shareText(`Akshar English — ${p.name}`, textReport(p));
            if (r === 'copied') setToast('📋 Report copied — paste it in WhatsApp');
          }}
        />
      )}
      {tab === 'more' && <MoreTab p={p} onSwitch={() => setView({ v: 'pick' })} onTeacher={() => setView({ v: 'teacher' })} installPrompt={install} />}
      <ReplayButton />
      <Nav tab={tab} onTab={(t) => setView({ v: 'main', tab: t })} due={dueItems(p, 99).length} />
      {toast && <div className="toast">{toast}</div>}
    </Shell>
  );
}

function Shell({ children, replay = false }: { children: React.ReactNode; replay?: boolean }) {
  return (
    <>
      <Sky />
      <div className="app">
        {children}
        {replay && <ReplayButton corner />}
      </div>
    </>
  );
}

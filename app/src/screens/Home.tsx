import { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../content/curriculum';
import type { Lesson } from '../content/types';
import { Mascot, ProgressRing } from '../components/ui';
import { lessonState, nextLesson, streak, totalStars } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { speak } from '../lib/speech';
import type { Profile, Settings } from '../lib/store';
import { today } from '../lib/store';

const KIND_LABEL: Record<Lesson['kind'], [string, string]> = {
  letters: ['Letters', 'अक्षर'],
  vocab: ['New words', 'नए शब्द'],
  phonics: ['Reading', 'पढ़ना'],
  sight: ['Sight words', 'पहचान वाले शब्द'],
  sentences: ['Sentences', 'वाक्य'],
  talk: ['Talking', 'बातचीत'],
  story: ['Story', 'कहानी'],
  checkpoint: ['Challenge', 'चुनौती'],
};

let greeted = '';

export function Home({
  p,
  settings,
  resume,
  onStart,
  onResume,
  onSwitch,
}: {
  p: Profile;
  settings: Settings;
  resume: { lessonId?: string; title: string; index: number; total: number } | null;
  onStart: (l: Lesson) => void;
  onResume: () => void;
  onSwitch: () => void;
}) {
  const next = nextLesson(p);
  const [tab, setTab] = useState(next?.level ?? p.level);
  const lv = LEVELS[tab - 1];
  const t = today();
  const min = Math.floor((p.daily[t]?.sec ?? 0) / 60);
  const showHi = p.level <= 2;
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (greeted === p.id + t) return;
    greeted = p.id + t;
    const tm = setTimeout(() => {
      void speak(showHi ? `नमस्ते ${p.name}! ${next ? 'आज का पाठ तैयार है।' : ''}` : `Hello ${p.name}! ${next ? 'Your next lesson is ready.' : ''}`, showHi ? 'hi' : 'en');
    }, 400);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

  const firstTab = useRef(true);
  useEffect(() => {
    if (firstTab.current) {
      firstTab.current = false;
      return;
    }
    nextRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [tab]);

  const tapNode = (l: Lesson) => {
    const st = lessonState(p, l);
    if (st === 'locked') {
      sfx.wrong();
      void speak(showHi ? 'पहले पिछला पाठ पूरा करो' : 'Finish the lesson before this one first', showHi ? 'hi' : 'en');
      return;
    }
    sfx.tap();
    onStart(l);
  };

  return (
    <div className="screen with-nav">
      <div className="row">
        <button className="avatar" style={{ width: 54, height: 54, fontSize: 32, borderRadius: 16 }} onClick={onSwitch} aria-label="Switch learner">
          {p.avatar}
        </button>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{p.name}</div>
          <div className="small" style={{ color: LEVELS[p.level - 1].color, fontWeight: 800 }}>
            {LEVELS[p.level - 1].emoji} Level {p.level} · <span className="hi">{LEVELS[p.level - 1].nameHi}</span>
          </div>
        </div>
        <div className="spacer" />
        <span className="chip" title="Days in a row">🔥 {streak(p)}</span>
        <span className="chip" title="Stars">⭐ {totalStars(p)}</span>
      </div>

      <div className="card row" style={{ padding: 14 }}>
        <ProgressRing value={min / settings.goalMin} size={70} color={min >= settings.goalMin ? 'var(--good)' : 'var(--primary)'}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{min}</div>
          <div style={{ fontSize: 11, fontWeight: 700 }} className="muted">
            min
          </div>
        </ProgressRing>
        <div style={{ flex: 1 }}>
          <div className="hi" style={{ fontWeight: 800 }}>
            {min >= settings.goalMin ? 'आज का लक्ष्य पूरा! 🎉' : `आज का लक्ष्य: ${settings.goalMin} मिनट`}
          </div>
          <div className="muted small">{min >= settings.goalMin ? "Today's goal done! Great work." : `Today's goal: ${settings.goalMin} minutes`}</div>
        </div>
      </div>

      {resume ? (
        <HeroCard color={LEVELS[(p.level || 1) - 1].color} emoji="⏯️" title={resume.title} sub={`${resume.index}/${resume.total}`} label="Continue · जारी रखो" onGo={onResume} />
      ) : next ? (
        <HeroCard
          color={LEVELS[next.level - 1].color}
          emoji={next.emoji}
          title={next.title}
          titleHi={next.titleHi}
          sub={`${KIND_LABEL[next.kind][0]} · ${KIND_LABEL[next.kind][1]}`}
          label={p.lessons[next.id]?.attempts ? 'Try again · फिर से ▶' : 'Start · शुरू करो ▶'}
          onGo={() => onStart(next)}
        />
      ) : (
        <div className="card row">
          <Mascot size={70} mood="happy" />
          <div>
            <h3>All lessons done! 🏆</h3>
            <div className="hi muted">सारे पाठ पूरे! दोहराओ और फाइनल टेस्ट दो।</div>
          </div>
        </div>
      )}

      <div className="level-tabs">
        {LEVELS.map((L) => (
          <button
            key={L.n}
            className={`level-tab ${tab === L.n ? 'on' : ''} ${L.n > p.level ? 'locked' : ''}`}
            style={tab === L.n ? { background: L.color } : undefined}
            onClick={() => setTab(L.n)}
          >
            {L.n > p.level ? '🔒' : L.emoji} {L.n}. <span className="hi">{L.nameHi}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ borderColor: lv.color, padding: 14 }}>
        <div style={{ fontWeight: 800, color: lv.color }}>
          {lv.emoji} Level {lv.n}: {lv.name} — {lv.stage}
        </div>
        <div className="hi small" style={{ fontWeight: 600 }}>🎯 {lv.goalHi}</div>
      </div>

      {lv.units.map((u, ui) => (
        <div key={u.id} className="unit">
          <div className="unit-head" style={{ background: lv.color }}>
            <span className="e">{u.emoji}</span>
            <div>
              <div style={{ fontSize: 14, opacity: 0.85 }}>Unit {ui + 1}</div>
              <div style={{ fontSize: 19 }}>{u.title}</div>
              <div className="hi" style={{ fontSize: 15, opacity: 0.9 }}>{u.titleHi}</div>
            </div>
          </div>
          <div className="path">
            {u.lessons.map((l, i) => {
              const st = lessonState(p, l);
              const rec = p.lessons[l.id];
              const isNext = next?.id === l.id;
              const offset = Math.sin((i + ui) * 1.3) * 70;
              return (
                <div key={l.id} ref={isNext ? nextRef : undefined} className={`node ${st}`} style={{ transform: `translateX(${offset}px)` }}>
                  <button className="circle" onClick={() => tapNode(l)} aria-label={l.title} style={st === 'open' ? { borderColor: lv.color } : undefined}>
                    {isNext && <span className="start-flag">START</span>}
                    {st === 'locked' ? '🔒' : l.emoji}
                  </button>
                  <div className="stars">{st === 'done' ? '⭐'.repeat(rec!.stars) + '☆'.repeat(3 - rec!.stars) : ''}</div>
                  <div className="label">{l.title}</div>
                  {showHi && <div className="label hi muted" style={{ fontSize: 13 }}>{l.titleHi}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroCard({ color, emoji, title, titleHi, sub, label, onGo }: { color: string; emoji: string; title: string; titleHi?: string; sub: string; label: string; onGo: () => void }) {
  return (
    <button
      onClick={() => {
        sfx.tap();
        onGo();
      }}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        color: '#fff',
        borderRadius: 26,
        padding: 18,
        textAlign: 'left',
        boxShadow: `0 7px 0 ${color}99, 0 14px 30px ${color}44`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{ fontSize: 64, background: 'rgba(255,255,255,.22)', borderRadius: 22, width: 92, height: 92, display: 'grid', placeItems: 'center', flex: 'none' }}>{emoji}</span>
      <span style={{ flex: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.9, display: 'block' }}>{sub}</span>
        <span style={{ fontSize: 23, fontWeight: 800, display: 'block', lineHeight: 1.15 }}>{title}</span>
        {titleHi && <span className="hi" style={{ fontSize: 17, display: 'block', opacity: 0.95 }}>{titleHi}</span>}
        <span style={{ marginTop: 8, display: 'inline-block', background: '#fff', color, borderRadius: 14, padding: '6px 14px', fontWeight: 800, fontSize: 17 }}>{label}</span>
      </span>
    </button>
  );
}

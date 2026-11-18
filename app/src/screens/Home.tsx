import { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../content/curriculum';
import type { Lesson } from '../content/types';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { Mascot, ProgressRing, Tr, useHindi } from '../components/ui';
import { lessonState, nextLesson, streak, totalStars } from '../lib/engine';
import { sfx } from '../lib/sfx';
import { setReplay, speak, speakSeq } from '../lib/speech';
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

const GAP = 164;
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
  const hindi = useHindi();
  const nextRef = useRef<HTMLDivElement>(null);
  const firstTab = useRef(true);

  useEffect(() => {
    const en = `Hello ${p.name}! ${next ? 'Your next lesson is ready.' : 'You finished every lesson. Great work!'}`;
    const parts = hindi ? ([[en, 'en', 'cheer'], [`नमस्ते ${p.name}! ${next ? 'अगला पाठ तैयार है।' : 'सारे पाठ पूरे हुए!'}`, 'hi']] as Array<[string, 'en' | 'hi', 'cheer'?]>) : ([[en, 'en', 'cheer']] as Array<[string, 'en', 'cheer']>);
    setReplay(parts as never);
    if (greeted === p.id + t) return;
    greeted = p.id + t;
    const tm = setTimeout(() => void speakSeq(parts as never), 500);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

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
      void speak('Finish the lesson before this one first.');
      return;
    }
    sfx.pop();
    onStart(l);
  };

  const L = next ? LEVELS[next.level - 1] : LEVELS[p.level - 1];

  return (
    <div className="screen with-nav">
      <div className="row">
        <button className="avatar" style={{ width: 58, height: 58, borderRadius: 20 }} onClick={onSwitch} aria-label="Switch learner">
          <Pic e={p.avatar} size={44} />
        </button>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 800, fontSize: 21 }}>{p.name}</div>
          <div style={{ color: LEVELS[p.level - 1].color, fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>
            Level {p.level} · {LEVELS[p.level - 1].name}
          </div>
        </div>
        <div className="spacer" />
        <span className="chip" title="Days in a row">
          <Icon name="flame" size={19} style={{ color: '#ff9f43' }} /> {streak(p)}
        </span>
        <span className="chip" title="Stars">
          <Icon name="star" size={18} stroke={1.2} /> {totalStars(p)}
        </span>
      </div>

      {resume ? (
        <HeroCard color={L.color} pic="⏯️" kicker="Continue" kickerHi="जारी रखें" title={resume.title} sub={`${resume.index} of ${resume.total}`} cta="Continue" ctaHi="जारी रखो" onGo={onResume} hindi={hindi} />
      ) : next ? (
        <HeroCard
          color={L.color}
          pic={next.emoji}
          kicker={`${KIND_LABEL[next.kind][0]}`}
          kickerHi={KIND_LABEL[next.kind][1]}
          title={next.title}
          titleHi={next.titleHi}
          sub={`Level ${next.level}`}
          cta={p.lessons[next.id]?.attempts ? 'Try again' : 'Start lesson'}
          ctaHi={p.lessons[next.id]?.attempts ? 'फिर से' : 'पाठ शुरू करो'}
          onGo={() => onStart(next)}
          hindi={hindi}
        />
      ) : (
        <div className="glass tint row" style={{ ['--tint' as string]: '#ffc857', padding: 18 }}>
          <Mascot size={86} mood="happy" level={4} float />
          <div>
            <h3>All lessons done!</h3>
            <div className="muted">Review your words, then take the final test.</div>
          </div>
        </div>
      )}

      <div className="glass row" style={{ padding: 14 }}>
        <ProgressRing value={min / settings.goalMin} size={68} color={min >= settings.goalMin ? 'var(--mint)' : 'var(--gold)'}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{min}</div>
          <div style={{ fontSize: 11, fontWeight: 700 }} className="muted">
            min
          </div>
        </ProgressRing>
        <div style={{ flex: 1, fontWeight: 800 }}>
          {min >= settings.goalMin ? <Tr en="Today's goal done!" hi="आज का लक्ष्य पूरा!" /> : <Tr en={`Today's goal: ${settings.goalMin} minutes`} hi={`आज का लक्ष्य: ${settings.goalMin} मिनट`} />}
        </div>
      </div>

      <div className="level-tabs">
        {LEVELS.map((X) => (
          <button key={X.n} className={`level-tab ${tab === X.n ? 'on' : ''} ${X.n > p.level ? 'locked' : ''}`} style={{ ['--lc' as string]: X.color }} onClick={() => setTab(X.n)}>
            {X.n > p.level ? <Icon name="lock" size={30} /> : <Pic e={X.emoji} size={34} flat />}
            <span>
              {X.n}. {X.name}
            </span>
          </button>
        ))}
      </div>

      <div className="glass tint" style={{ ['--tint' as string]: lv.color, padding: '14px 16px' }}>
        <div style={{ fontWeight: 800, fontSize: 19 }}>
          Level {lv.n}: {lv.name}
        </div>
        <div className="muted small">{lv.goal}</div>
        {hindi && <div className="hi muted" style={{ fontSize: 14, marginTop: 2 }}>{lv.goalHi}</div>}
      </div>

      {lv.units.map((u, ui) => {
        const H = u.lessons.length * GAP;
        const xs = u.lessons.map((_, i) => 50 + Math.sin((i + ui) * 1.3) * 25);
        let d = '';
        xs.forEach((x, i) => {
          const y = i * GAP + 46;
          d += i === 0 ? `M ${x} ${y}` : ` C ${xs[i - 1]} ${y - GAP / 2}, ${x} ${y - GAP / 2}, ${x} ${y}`;
        });
        return (
          <div key={u.id} className="col" style={{ ['--lc' as string]: lv.color, gap: 6 }}>
            <div className="glass tint unit-head" style={{ ['--tint' as string]: lv.color }}>
              <Pic e={u.emoji} size={52} />
              <div>
                <div className="u-no">Unit {ui + 1}</div>
                <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.1 }}>
                  <Tr en={u.title} hi={u.titleHi} />
                </div>
              </div>
            </div>
            <div className="path" style={{ height: H }}>
              <svg className="trail" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden>
                <path d={d} fill="none" stroke={lv.color} strokeOpacity=".45" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              {u.lessons.map((l, i) => {
                const st = lessonState(p, l);
                const rec = p.lessons[l.id];
                const isNext = next?.id === l.id;
                return (
                  <div key={l.id} ref={isNext ? nextRef : undefined} className={`node ${st}`} style={{ left: `${xs[i]}%`, top: i * GAP }}>
                    <button className="circle" onClick={() => tapNode(l)} aria-label={l.title}>
                      {isNext && <span className="start-flag">START</span>}
                      {st === 'locked' ? <Icon name="lock" size={34} style={{ color: 'var(--ink-3)' }} /> : <Pic e={l.emoji} size={64} />}
                    </button>
                    <div style={{ display: 'flex', gap: 2, height: 18, color: 'var(--gold)' }}>
                      {st === 'done' &&
                        [0, 1, 2].map((k) => (
                          <Icon key={k} name="star" size={16} stroke={1.2} style={{ opacity: k < rec!.stars ? 1 : 0.25 }} />
                        ))}
                    </div>
                    <div className="label">
                      <Tr en={l.title} hi={l.titleHi} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeroCard({
  color,
  pic,
  kicker,
  kickerHi: _kh,
  title,
  titleHi,
  sub,
  cta,
  ctaHi,
  onGo,
  hindi,
}: {
  color: string;
  pic: string;
  kicker: string;
  kickerHi: string;
  title: string;
  titleHi?: string;
  sub: string;
  cta: string;
  ctaHi: string;
  onGo: () => void;
  hindi: boolean;
}) {
  return (
    <div className="hero-card" style={{ ['--lc' as string]: color }}>
      <div className="pic-wrap">
        <Pic e={pic} size={78} />
      </div>
      <div style={{ flex: 1, minWidth: 0, position: 'relative', paddingRight: 34 }}>
        <div className="kicker">
          {kicker} · {sub}
        </div>
        <div className="ttl">{title}</div>
        {hindi && titleHi && <div className="hi muted" style={{ fontSize: 16 }}>{titleHi}</div>}
        <button
          className="btn gold small"
          style={{ marginTop: 10 }}
          onClick={() => {
            sfx.pop();
            onGo();
          }}
        >
          <Tr en={cta} hi={ctaHi} /> <Icon name="next" size={20} stroke={3} />
        </button>
      </div>
      <div style={{ position: 'absolute', right: 8, top: 6, pointerEvents: 'none' }}>
        <Mascot size={46} mood="wave" level={1} float />
      </div>
    </div>
  );
}

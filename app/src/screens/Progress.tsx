import { LEVELS, levelLessons } from '../content/curriculum';
import { SKILLS, SKILL_INFO } from '../content/types';
import { wordLabel } from '../content/words';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { Mascot, Tr, useSayOnce } from '../components/ui';
import { lessonsDone, skillScore, streak, testPct, totalStars, wordsKnown } from '../lib/engine';
import type { Profile } from '../lib/store';
import { addDays, daysBetween, today } from '../lib/store';

export function finalTestStatus(p: Profile): { available: boolean; reason: string } {
  if (!p.placement) return { available: false, reason: 'Take the starting test first.' };
  const days = daysBetween(p.placement.date, today());
  const done = lessonsDone(p);
  if (days >= 28 || done >= 12) return { available: true, reason: '' };
  return { available: false, reason: `Opens after 4 weeks or 12 lessons. Now: ${days} days, ${done} lessons.` };
}

export function retentionDue(p: Profile) {
  return !!p.endline && !p.retention && daysBetween(p.endline.date, today()) >= 14;
}

export function weekMinutes(p: Profile) {
  let s = 0;
  for (let i = 0; i < 7; i++) s += p.daily[addDays(today(), -i)]?.sec ?? 0;
  return Math.round(s / 60);
}

export function Progress({ p, onFinalTest, onRetention, onShare }: { p: Profile; onFinalTest: () => void; onRetention: () => void; onShare: () => void }) {
  const lv = LEVELS[p.level - 1];
  const list = levelLessons(p.level);
  const doneInLevel = list.filter((l) => p.lessons[l.id]?.stars).length;
  const ft = finalTestStatus(p);
  useSayOnce([[`${p.name}, you know ${wordsKnown(p)} words and finished ${lessonsDone(p)} lessons. Keep going!`, 'en', 'cheer']]);
  const known = Object.entries(p.items)
    .filter(([k, s]) => (k.startsWith('w:') || k.startsWith('l:') || k.startsWith('g:')) && s.right > 0)
    .sort((a, b) => b[1].box - a[1].box)
    .map(([k, s]) => ({ k, s, w: wordLabel(k) }))
    .filter((x) => x.w);

  return (
    <div className="screen with-nav">
      <div className="row">
        <Pic e={p.avatar} size={56} />
        <h2>
          <Tr en="My English journey" hi="मेरी अंग्रेज़ी यात्रा" />
        </h2>
      </div>

      <div className="glass tint col" style={{ ['--tint' as string]: lv.color }}>
        <div className="row">
          <Mascot size={84} mood="happy" level={p.level} float />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: lv.color, fontSize: 22 }}>
              Level {lv.n}: {lv.name}
            </div>
            <div className="muted small">{lv.stage}</div>
          </div>
        </div>
        <div className="bar" style={{ height: 16, color: lv.color }}>
          <div style={{ width: `${(doneInLevel / list.length) * 100}%`, background: lv.color }} />
        </div>
        <div className="small muted">
          {doneInLevel} of {list.length} lessons in this level
        </div>
        {p.placement && p.startLevel < p.level && <span className="flag green" style={{ alignSelf: 'flex-start' }}>Moved up from Level {p.startLevel} to Level {p.level}</span>}
      </div>

      <div className="row" style={{ gap: 8 }}>
        <div className="stat">
          <div className="n">{wordsKnown(p)}</div>
          <div className="t"><Tr en="Words" hi="शब्द" /></div>
        </div>
        <div className="stat">
          <div className="n">{lessonsDone(p)}</div>
          <div className="t"><Tr en="Lessons" hi="पाठ" /></div>
        </div>
        <div className="stat">
          <div className="n" style={{ color: 'var(--gold)' }}>{totalStars(p)}</div>
          <div className="t"><Tr en="Stars" hi="सितारे" /></div>
        </div>
        <div className="stat">
          <div className="n" style={{ color: '#ff9f43' }}>{streak(p)}</div>
          <div className="t"><Tr en="Day streak" hi="दिन" /></div>
        </div>
      </div>

      <div className="glass col">
        <h3>
          <Tr en="My skills" hi="मेरे हुनर" />
        </h3>
        {SKILLS.map((k) => {
          const now = skillScore(p, k);
          const base = testPct(p.placement, k);
          return (
            <div key={k} className="skill">
              <Pic e={SKILL_INFO[k].icon} size={34} flat />
              <div>
                <div className="small" style={{ fontWeight: 700 }}>
                  <Tr en={SKILL_INFO[k].en} hi={SKILL_INFO[k].hi} line />
                </div>
                <div className="bar" style={{ color: SKILL_INFO[k].color }}>
                  <div style={{ width: `${now ?? 0}%`, background: SKILL_INFO[k].color }} />
                  {base !== null && <span className="base" style={{ left: `${base}%` }} title="Starting test" />}
                </div>
              </div>
              <span style={{ fontWeight: 800, textAlign: 'right' }}>{now === null ? '–' : `${now}%`}</span>
            </div>
          );
        })}
        <div className="muted small">Bars show your recent first-try answers. The white mark is your starting test.</div>
      </div>

      <div className="glass col">
        <h3>
          <Tr en="Tests" hi="टेस्ट" />
        </h3>
        <TestRow label="Starting test" r={p.placement} />
        <TestRow label="Final test" r={p.endline} />
        {p.retention && (
          <div className="row small">
            <span>Memory check</span>
            <span className="spacer" />
            <b>{Math.round((p.retention.right / p.retention.total) * 100)}%</b>
          </div>
        )}
        {!p.endline && (
          <>
            <button className="btn gold block" disabled={!ft.available} onClick={onFinalTest}>
              <Icon name="trophy" size={26} /> <Tr en="Final test" hi="फाइनल टेस्ट" />
            </button>
            {!ft.available && <div className="muted small">{ft.reason}</div>}
          </>
        )}
        {retentionDue(p) && (
          <button className="btn cyan block" onClick={onRetention}>
            <Icon name="brain" size={26} /> <Tr en="Memory check" hi="याद की जाँच" />
          </button>
        )}
      </div>

      {known.length > 0 && (
        <div className="glass col">
          <h3>
            <Tr en={`Words I know (${known.length})`} hi="मुझे आते हैं" />
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {known.slice(0, 80).map(({ k, s, w }) => (
              <span key={k} className="chip" style={{ borderColor: s.box >= 3 ? 'rgba(52,229,160,.7)' : s.box >= 1 ? 'rgba(255,184,77,.6)' : undefined, background: s.box >= 3 ? 'rgba(52,229,160,.16)' : undefined }}>
                <Pic e={w!.emoji} size={26} flat /> {w!.en}
              </span>
            ))}
          </div>
          <div className="muted small">Green means strong. Amber means still learning.</div>
        </div>
      )}

      {p.writings.length > 0 && (
        <div className="glass col">
          <h3>
            <Tr en="My writing" hi="मैंने लिखा" />
          </h3>
          {p.writings
            .slice(-6)
            .reverse()
            .map((w, i) => (
              <div key={i} style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 12 }}>
                <div className="muted small">{w.date} · {w.prompt}</div>
                <div className="read" style={{ fontWeight: 700 }}>{w.text}</div>
              </div>
            ))}
        </div>
      )}

      <button className="btn cyan block" onClick={onShare}>
        <Icon name="share" size={24} /> <Tr en="Send report to teacher" hi="टीचर को रिपोर्ट भेजो" />
      </button>
    </div>
  );
}

function TestRow({ label, r }: { label: string; r?: { date: string; level: number } }) {
  return (
    <div className="row small">
      <span>{label}</span>
      <span className="spacer" />
      {r ? (
        <b style={{ color: LEVELS[r.level - 1].color }}>
          Level {r.level} · {r.date}
        </b>
      ) : (
        <span className="muted">Not yet</span>
      )}
    </div>
  );
}

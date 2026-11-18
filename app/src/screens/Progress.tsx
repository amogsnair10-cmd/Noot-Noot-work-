import { LEVELS, levelLessons } from '../content/curriculum';
import { SKILLS, SKILL_INFO } from '../content/types';
import { wordLabel } from '../content/words';
import { lessonsDone, skillScore, streak, testPct, totalStars, wordsKnown } from '../lib/engine';
import type { Profile } from '../lib/store';
import { addDays, daysBetween, today } from '../lib/store';

export function finalTestStatus(p: Profile): { available: boolean; reasonHi: string; reason: string } {
  if (!p.placement) return { available: false, reason: 'Take the starting test first.', reasonHi: 'पहले शुरुआती टेस्ट दो।' };
  const days = daysBetween(p.placement.date, today());
  const done = lessonsDone(p);
  if (days >= 28 || done >= 12) return { available: true, reason: '', reasonHi: '' };
  return {
    available: false,
    reason: `Opens after 4 weeks or 12 lessons (now: ${days} days, ${done} lessons).`,
    reasonHi: `4 हफ़्ते या 12 पाठ के बाद खुलेगा (अभी: ${days} दिन, ${done} पाठ)।`,
  };
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
  const known = Object.entries(p.items)
    .filter(([k, s]) => (k.startsWith('w:') || k.startsWith('l:') || k.startsWith('g:')) && s.right > 0)
    .sort((a, b) => b[1].box - a[1].box)
    .map(([k, s]) => ({ k, s, w: wordLabel(k) }))
    .filter((x) => x.w);

  return (
    <div className="screen with-nav">
      <div className="row">
        <span style={{ fontSize: 46 }}>{p.avatar}</span>
        <div>
          <h2 className="hi">मेरी इंग्लिश यात्रा</h2>
          <div className="muted">My English journey</div>
        </div>
      </div>

      <div className="card col" style={{ borderColor: lv.color }}>
        <div className="row">
          <span style={{ fontSize: 44 }}>{lv.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: lv.color, fontSize: 20 }}>
              Level {lv.n}: {lv.name}
            </div>
            <div className="hi small">{lv.nameHi} · {lv.stageHi}</div>
          </div>
        </div>
        <div className="bar" style={{ height: 18 }}>
          <div style={{ width: `${(doneInLevel / list.length) * 100}%`, background: lv.color }} />
        </div>
        <div className="small muted">
          {doneInLevel}/{list.length} lessons in this level · <span className="hi">इस लेवल के पाठ</span>
        </div>
        {p.placement && p.startLevel < p.level && (
          <div className="flag green" style={{ alignSelf: 'flex-start' }}>
            🚀 Moved up from Level {p.startLevel} to Level {p.level}!
          </div>
        )}
      </div>

      <div className="row" style={{ gap: 8 }}>
        <div className="stat">
          <div className="n">{wordsKnown(p)}</div>
          <div className="t hi">शब्द · words</div>
        </div>
        <div className="stat">
          <div className="n">{lessonsDone(p)}</div>
          <div className="t hi">पाठ · lessons</div>
        </div>
        <div className="stat">
          <div className="n">⭐{totalStars(p)}</div>
          <div className="t hi">सितारे · stars</div>
        </div>
        <div className="stat">
          <div className="n">🔥{streak(p)}</div>
          <div className="t hi">दिन · days</div>
        </div>
      </div>

      <div className="card col">
        <h3>
          <span className="hi">मेरे हुनर</span> · My skills
        </h3>
        {SKILLS.map((k) => {
          const now = skillScore(p, k);
          const base = testPct(p.placement, k);
          return (
            <div key={k} className="skill">
              <span className="ico">{SKILL_INFO[k].icon}</span>
              <div>
                <div className="small" style={{ fontWeight: 700 }}>
                  <span className="hi">{SKILL_INFO[k].hi}</span> · {SKILL_INFO[k].en}
                </div>
                <div className="bar">
                  <div style={{ width: `${now ?? 0}%`, background: SKILL_INFO[k].color }} />
                  {base !== null && <span className="base" style={{ left: `${base}%` }} title="Starting test" />}
                </div>
              </div>
              <span style={{ fontWeight: 800, textAlign: 'right' }}>{now === null ? '–' : `${now}%`}</span>
            </div>
          );
        })}
        <div className="muted small">Bars show your recent answers on the first try. ▏ = starting test. · <span className="hi">▏= शुरुआती टेस्ट</span></div>
      </div>

      <div className="card col">
        <h3>
          🏁 <span className="hi">टेस्ट</span> · Tests
        </h3>
        <TestRow label="Starting test · शुरुआती टेस्ट" r={p.placement} />
        <TestRow label="Final test · फाइनल टेस्ट" r={p.endline} />
        {p.retention && (
          <div className="row small">
            <span>🧠 Memory check · याद की जाँच</span>
            <span className="spacer" />
            <b>{Math.round((p.retention.right / p.retention.total) * 100)}%</b>
          </div>
        )}
        {!p.endline && (
          <>
            <button className="btn violet block" disabled={!ft.available} onClick={onFinalTest}>
              {'🏆 दिखाओ क्या सीखा · Final test'}
            </button>
            {!ft.available && (
              <div className="muted small">
                {ft.reason} <span className="hi">{ft.reasonHi}</span>
              </div>
            )}
          </>
        )}
        {retentionDue(p) && (
          <button className="btn teal block" onClick={onRetention}>
            {'🧠 याद की जाँच · Memory check'}
          </button>
        )}
      </div>

      {known.length > 0 && (
        <div className="card col">
          <h3>
            <span className="hi">मुझे आते हैं</span> · Words I know ({known.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {known.slice(0, 80).map(({ k, s, w }) => (
              <span key={k} className="chip" style={{ background: s.box >= 3 ? '#e2f6e9' : s.box >= 1 ? '#fff1d6' : '#f3eee6' }}>
                {w!.emoji} {w!.en}
              </span>
            ))}
          </div>
          <div className="muted small">🟩 strong · 🟨 learning · <span className="hi">हरा = पक्का, पीला = सीख रहे हैं</span></div>
        </div>
      )}

      {p.writings.length > 0 && (
        <div className="card col">
          <h3>
            ✍️ <span className="hi">मैंने लिखा</span> · My writing
          </h3>
          {p.writings
            .slice(-6)
            .reverse()
            .map((w, i) => (
              <div key={i} style={{ borderLeft: '4px solid var(--primary)', paddingLeft: 10 }}>
                <div className="muted small">{w.date} · {w.prompt}</div>
                <div style={{ fontWeight: 700 }}>{w.text}</div>
              </div>
            ))}
        </div>
      )}

      <button className="btn teal block" onClick={onShare}>
        {'📤 टीचर को रिपोर्ट भेजो · Send report'}
      </button>
    </div>
  );
}

function TestRow({ label, r }: { label: string; r?: { date: string; level: number } }) {
  return (
    <div className="row small">
      <span className="hi">{label}</span>
      <span className="spacer" />
      {r ? (
        <b style={{ color: LEVELS[r.level - 1].color }}>
          {LEVELS[r.level - 1].emoji} L{r.level} · {r.date}
        </b>
      ) : (
        <span className="muted">—</span>
      )}
    </div>
  );
}

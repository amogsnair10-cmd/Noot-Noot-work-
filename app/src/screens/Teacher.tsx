import { useRef, useState } from 'react';
import { Pic } from '../components/Doodle';
import { Icon } from '../components/Icon';
import { LEVELS } from '../content/curriculum';
import { SKILLS, SKILL_INFO } from '../content/types';
import { wordLabel } from '../content/words';
import { lessonsDone, skillScore, stuckLessons, testPct, weakItems } from '../lib/engine';
import { csvReport, download, shareText, textReport } from '../lib/report';
import type { Profile } from '../lib/store';
import { addDays, daysBetween, exportBackup, importBackup, setState, today, updateProfile, useAppState } from '../lib/store';
import { weekMinutes } from './Progress';

export function Teacher({ onExit, onRunFinal }: { onExit: () => void; onRunFinal: (id: string) => void }) {
  const app = useAppState();
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (!ok)
    return (
      <div className="screen center" style={{ gap: 16 }}>
        <Icon name="teacher" size={64} style={{ color: 'var(--violet-2)' }} />
        <h2>Teacher area</h2>
        <div className="muted">Enter PIN (default 1234 — please change it)</div>
        <input
          className="text-input"
          style={{ textAlign: 'center', letterSpacing: 8, maxWidth: 220 }}
          inputMode="numeric"
          type="password"
          value={pin}
          maxLength={8}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && pin === app.settings.teacherPin && setOk(true)}
        />
        <button className="btn" disabled={pin !== app.settings.teacherPin} onClick={() => setOk(true)}>
          Open
        </button>
        <button className="btn ghost small" onClick={onExit}>
          <Icon name="back" size={20} /> Back
        </button>
      </div>
    );

  const p = app.profiles.find((x) => x.id === sel);
  if (p) return <LearnerDetail p={p} onBack={() => setSel(null)} onRunFinal={() => onRunFinal(p.id)} />;

  const ps = app.profiles;
  const flags = (x: Profile) => {
    const out: Array<[string, string]> = [];
    const last = Object.keys(x.daily).sort().pop();
    if (!x.placement) out.push(['red', 'No starting test']);
    if (last && daysBetween(last, today()) >= 3) out.push(['', `Inactive ${daysBetween(last, today())}d`]);
    if (stuckLessons(x).length) out.push(['red', `Stuck ×${stuckLessons(x).length}`]);
    if (x.level > x.startLevel) out.push(['green', `Up ${x.level - x.startLevel} level`]);
    return out;
  };

  return (
    <div className="screen">
      <div className="row">
        <button className="icon-btn" onClick={onExit} aria-label="Back">
          <Icon name="back" size={24} stroke={2.8} />
        </button>
        <h2>Teacher dashboard</h2>
      </div>

      <div className="row" style={{ gap: 8 }}>
        {LEVELS.map((L) => (
          <div key={L.n} className="stat">
            <div className="n" style={{ color: L.color }}>{ps.filter((x) => x.level === L.n).length}</div>
            <div className="t" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Pic e={L.emoji} size={22} flat /> L{L.n}
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: 10, overflowX: 'auto' }}>
        <table className="t">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Start→Now</th>
              <th>Lessons</th>
              <th>7d min</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {ps.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No learners on this phone yet.
                </td>
              </tr>
            )}
            {ps.map((x) => (
              <tr key={x.id} onClick={() => setSel(x.id)} style={{ cursor: 'pointer' }}>
                <td>
                  <b style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Pic e={x.avatar} size={28} flat /> {x.name}
                  </b>
                </td>
                <td>
                  L{x.placement?.level ?? '?'} → L{x.level}
                </td>
                <td>{lessonsDone(x)}</td>
                <td>{weekMinutes(x)}</td>
                <td>
                  {flags(x).map(([c, t]) => (
                    <span key={t} className={`flag ${c}`} style={{ marginRight: 4 }}>
                      {t}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass col">
        <h3>Reports & data</h3>
        <div className="muted small">Each learner uses their own phone, so collect reports by sharing (WhatsApp) or by downloading the CSV. A backup file moves a learner to a new phone.</div>
        <button className="btn cyan block small" onClick={() => download(`akshar-class-${today()}.csv`, csvReport(ps), 'text/csv')}>
          <Icon name="download" size={22} /> Download CSV (all learners)
        </button>
        <button
          className="btn ghost block small"
          onClick={async () => {
            const r = await shareText('Akshar English reports', ps.map(textReport).join('\n\n———\n\n'));
            setMsg(r === 'copied' ? 'Copied to clipboard.' : r === 'failed' ? 'Could not share.' : '');
          }}
        >
          <Icon name="share" size={22} /> Share text reports
        </button>
        <div className="row">
          <button className="btn ghost small" style={{ flex: 1 }} onClick={() => download(`akshar-backup-${today()}.json`, exportBackup(), 'application/json')}>
            <Icon name="download" size={20} /> Backup
          </button>
          <button className="btn ghost small" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={20} /> Restore
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setMsg(importBackup(await f.text()) ? 'Backup restored.' : 'That file is not a valid backup.');
          }}
        />
        {msg && <div className="flag green">{msg}</div>}
      </div>

      <TeacherSettings />
    </div>
  );
}

function TeacherSettings() {
  const app = useAppState();
  const s = app.settings;
  const [newPin, setNewPin] = useState('');
  const set = (patch: Partial<typeof s>) => setState((st) => ({ ...st, settings: { ...st.settings, ...patch } }));
  return (
    <div className="glass col">
      <h3>Settings</h3>
      <label className="row">
        <span style={{ flex: 1 }}>Daily goal (minutes)</span>
        <select className="text-input" style={{ width: 110, padding: 8, fontSize: 18 }} value={s.goalMin} onChange={(e) => set({ goalMin: +e.target.value })}>
          {[15, 20, 25, 30, 40].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <label className="row">
        <span style={{ flex: 1 }}>Daily limit (minutes)</span>
        <select className="text-input" style={{ width: 110, padding: 8, fontSize: 18 }} value={s.dailyLimitMin} onChange={(e) => set({ dailyLimitMin: +e.target.value })}>
          {[30, 40, 45, 60].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <div className="row">
        <input className="text-input" style={{ flex: 1, padding: 10, fontSize: 18 }} inputMode="numeric" placeholder="New PIN" value={newPin} maxLength={8} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))} />
        <button
          className="btn small"
          disabled={newPin.length < 4}
          onClick={() => {
            set({ teacherPin: newPin });
            setNewPin('');
          }}
        >
          Change PIN
        </button>
      </div>
    </div>
  );
}

function LearnerDetail({ p, onBack, onRunFinal }: { p: Profile; onBack: () => void; onRunFinal: () => void }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const weak = weakItems(p, 12)
    .map((k) => wordLabel(k))
    .filter(Boolean);
  const stuck = stuckLessons(p);
  return (
    <div className="screen">
      <div className="row">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" size={24} stroke={2.8} />
        </button>
        <Pic e={p.avatar} size={52} />
        <div>
          <h2>{p.name}</h2>
          <div className="muted small">
            {p.age} · since {p.createdAt}
          </div>
        </div>
      </div>

      <div className="glass col">
        <h3>Skills: start · now · final</h3>
        <table className="t">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Start</th>
              <th>Now</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((k) => (
              <tr key={k}>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Pic e={SKILL_INFO[k].icon} size={24} flat /> {SKILL_INFO[k].en}
                  </span>
                </td>
                <td>{testPct(p.placement, k) ?? '–'}%</td>
                <td>{skillScore(p, k) ?? '–'}%</td>
                <td>{testPct(p.endline, k) ?? '–'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted small">“Now” = first-try accuracy on the last 20 answers in that skill. Speaking “now” only counts phones with speech recognition, so also use the rubric below.</div>
      </div>

      <div className="glass col">
        <h3>Speaking rubric (your judgement)</h3>
        <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {['0 Not yet', '1 Beginning', '2 Developing', '3 Independent', '4 Applying'].map((t, i) => (
            <button key={t} className={`chip ${p.speakingRubric === i ? 'flag green' : ''}`} onClick={() => updateProfile(p.id, (x) => ({ ...x, speakingRubric: i }))}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {(stuck.length > 0 || weak.length > 0) && (
        <div className="glass col">
          <h3>Needs help</h3>
          {stuck.map((l) => (
            <div key={l.id} className="flag red">
              Failed twice: {l.title} — the app now gives easier options and more Hindi help. Try teaching it in person.
            </div>
          ))}
          {weak.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {weak.map((w, i) => (
                <span key={i} className="chip">
                  <Pic e={w!.emoji} size={22} flat /> {w!.en}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="glass col">
        <h3>Actions</h3>
        <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          <span>Level:</span>
          {LEVELS.map((L) => (
            <button key={L.n} className={`chip ${p.level === L.n ? 'flag green' : ''}`} onClick={() => updateProfile(p.id, (x) => ({ ...x, level: L.n, startLevel: Math.min(x.startLevel, L.n) }))}>
              <Pic e={L.emoji} size={20} flat /> {L.n}
            </button>
          ))}
        </div>
        <button className="btn ghost block small" onClick={() => updateProfile(p.id, (x) => ({ ...x, extraTimeDate: today() }))}>
          <Icon name="clock" size={22} /> Allow extra time today {p.extraTimeDate === today() ? '(on)' : ''}
        </button>
        <button className="btn gold block small" onClick={onRunFinal}>
          <Icon name="trophy" size={22} /> Run final test now
        </button>
        <button className="btn ghost block small" onClick={() => void shareText(`Report ${p.name}`, textReport(p))}>
          <Icon name="share" size={22} /> Share this report
        </button>
        {!confirmDel ? (
          <button className="btn ghost block small" style={{ color: '#ff9aa5' }} onClick={() => setConfirmDel(true)}>
            <Icon name="trash" size={22} /> Delete learner
          </button>
        ) : (
          <button
            className="btn danger block small"
            onClick={() => {
              setState((s) => ({ ...s, profiles: s.profiles.filter((x) => x.id !== p.id), activeId: s.activeId === p.id ? null : s.activeId }));
              onBack();
            }}
          >
            Yes, delete {p.name} and all progress
          </button>
        )}
      </div>

      <div className="glass col">
        <h3>Last 7 days</h3>
        <div className="row" style={{ alignItems: 'flex-end', height: 90, gap: 6 }}>
          {Array.from({ length: 7 }, (_, i) => {
            const d = addDays(today(), i - 6);
            const m = Math.round((p.daily[d]?.sec ?? 0) / 60);
            return (
              <div key={d} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: Math.min(60, m), background: 'linear-gradient(180deg,var(--cyan),var(--violet))', borderRadius: 6, minHeight: 2 }} />
                <div className="small muted">{m}</div>
              </div>
            );
          })}
        </div>
        <div className="muted small">Minutes per day (oldest → today)</div>
      </div>
    </div>
  );
}

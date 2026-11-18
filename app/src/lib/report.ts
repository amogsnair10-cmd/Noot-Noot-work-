import { LEVELS } from '../content/curriculum';
import { SKILLS, SKILL_INFO } from '../content/types';
import { lessonsDone, skillScore, streak, stuckLessons, testPct, wordsKnown } from './engine';
import type { Profile } from './store';
import { addDays, today } from './store';

function weekMin(p: Profile) {
  let s = 0;
  for (let i = 0; i < 7; i++) s += p.daily[addDays(today(), -i)]?.sec ?? 0;
  return Math.round(s / 60);
}

export function textReport(p: Profile): string {
  const lv = LEVELS[p.level - 1];
  const lines = [
    `📘 Akshar English report — ${p.name} ${p.avatar}`,
    `Date: ${today()}`,
    `Level now: ${p.level} ${lv.name} (${lv.nameHi})`,
    p.placement ? `Started at: Level ${p.placement.level} on ${p.placement.date}` : 'Starting test: not taken',
    p.endline ? `Final test: Level ${p.endline.level} on ${p.endline.date}` : '',
    `Lessons done: ${lessonsDone(p)} · Words known: ${wordsKnown(p)} · Streak: ${streak(p)} days`,
    `Time this week: ${weekMin(p)} min`,
    '',
    'Skills (start → now):',
    ...SKILLS.map((k) => {
      const b = testPct(p.placement, k);
      const n = skillScore(p, k);
      const e = testPct(p.endline, k);
      return `${SKILL_INFO[k].icon} ${SKILL_INFO[k].en}: ${b ?? '–'}% → ${n ?? '–'}%${e !== null ? ` (final test ${e}%)` : ''}`;
    }),
  ];
  const stuck = stuckLessons(p);
  if (stuck.length) lines.push('', `⚠️ Needs help with: ${stuck.map((l) => l.title).join(', ')}`);
  return lines.filter((x) => x !== '').join('\n');
}

const esc = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function csvReport(ps: Profile[]): string {
  const head = [
    'name', 'age_group', 'created', 'start_level', 'current_level',
    ...SKILLS.map((k) => `baseline_${k}`),
    ...SKILLS.map((k) => `current_${k}`),
    ...SKILLS.map((k) => `final_${k}`),
    'final_level', 'final_date', 'skills_improved', 'retention_pct',
    'lessons_done', 'words_known', 'minutes_7d', 'minutes_total', 'days_active', 'speaking_rubric_0_4', 'stuck_lessons',
  ];
  const rows = ps.map((p) => {
    const base = SKILLS.map((k) => testPct(p.placement, k));
    const cur = SKILLS.map((k) => skillScore(p, k));
    const fin = SKILLS.map((k) => testPct(p.endline, k));
    const after = p.endline ? fin : cur;
    const improved = SKILLS.filter((_, i) => base[i] !== null && after[i] !== null && after[i]! - base[i]! >= 10).length;
    const totalSec = Object.values(p.daily).reduce((a, d) => a + d.sec, 0);
    return [
      p.name, p.age, p.createdAt, p.placement?.level ?? '', p.level,
      ...base, ...cur, ...fin,
      p.endline?.level ?? '', p.endline?.date ?? '', improved,
      p.retention ? Math.round((p.retention.right / p.retention.total) * 100) : '',
      lessonsDone(p), wordsKnown(p), weekMin(p), Math.round(totalSec / 60),
      Object.values(p.daily).filter((d) => d.sec > 60).length, p.speakingRubric ?? '',
      stuckLessons(p).map((l) => l.title).join('; '),
    ].map(esc).join(',');
  });
  return [head.join(','), ...rows].join('\n');
}

export function download(name: string, text: string, type = 'text/plain') {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch {
    /* ignore */
  }
}

export async function shareText(title: string, text: string): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return 'shared';
    }
  } catch {
    /* user cancelled or unsupported */
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}

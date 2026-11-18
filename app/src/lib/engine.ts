import { LESSON_MAP, LEVELS, levelLessons } from '../content/curriculum';
import { DIALOGUES, PASSAGES, SENTENCES } from '../content/sentences';
import type { Lesson, Question, Skill, Word } from '../content/types';
import { SKILLS } from '../content/types';
import { LETTERS, LETTER_MAP, SIGHT, WORDS } from '../content/words';
import type { Part } from './speech';
import type { ItemStat, Profile, TestResult } from './store';
import { addDays, today } from './store';

// ---------------------------------------------------------------- Steps

export type Phase = 'warmup' | 'learn' | 'practice' | 'apply' | 'check';
export type Audio = Part[];

export interface Instruction {
  key: string;
  en: string;
  hi: string;
}

export interface Option {
  label?: string;
  emoji?: string;
  hi?: string;
  say?: string; // spoken when tapped
  style: 'emoji' | 'text' | 'letter' | 'hindi' | 'answer';
}

interface Base {
  id: string;
  phase: Phase;
  skill: Skill;
  item: string;
  ins: Instruction;
}

export type Step =
  | (Base & { kind: 'teachWord'; word: Word })
  | (Base & { kind: 'teachLetter'; ch: string })
  | (Base & { kind: 'teachBlend'; word: Word })
  | (Base & { kind: 'teachSight'; sight: string })
  | (Base & { kind: 'teachSentence'; en: string; hi: string; scene: string })
  | (Base & { kind: 'teachDialogue'; q: string; qhi: string; a: string; ahi: string; scene: string })
  | (Base & { kind: 'readAlong'; passageId: string })
  | (Base & {
      kind: 'choice';
      prompt: { audio?: Audio; text?: string; emoji?: string; big?: 'letter' | 'word' | 'sentence'; hi?: string };
      options: Option[];
      answer: number;
    })
  | (Base & { kind: 'build'; word: string; emoji?: string; hi?: string; tiles: string[] })
  | (Base & { kind: 'order'; sentence: string; hi?: string; scene?: string; tiles: string[] })
  | (Base & { kind: 'trace'; ch: string })
  | (Base & { kind: 'say'; text: string; hi?: string; emoji?: string })
  | (Base & { kind: 'write'; promptEn: string; promptHi: string });

export interface StepResult {
  stepId: string;
  phase: Phase;
  skill: Skill;
  item: string;
  correct: boolean;
  assisted: boolean;
  scored: boolean;
}

// ---------------------------------------------------------------- helpers

let uid = 0;
const nid = () => `s${++uid}`;

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const sample = <T,>(a: T[], n: number) => shuffle(a).slice(0, n);

function withAnswer<T>(correct: T, distractors: T[]): { options: T[]; answer: number } {
  const options = shuffle([correct, ...distractors]);
  return { options, answer: options.indexOf(correct) };
}

const INS: Record<string, Instruction> = {
  teach: { key: 'teach', en: 'Look and listen', hi: 'देखो और सुनो' },
  teachLetter: { key: 'teachLetter', en: 'A new letter', hi: 'नया अक्षर' },
  blend: { key: 'blend', en: 'Join the sounds', hi: 'आवाज़ों को जोड़ो' },
  sight: { key: 'sight', en: 'A word to remember', hi: 'याद रखने वाला शब्द' },
  sentence: { key: 'sentence', en: 'Read along', hi: 'साथ में पढ़ो' },
  dialogue: { key: 'dialogue', en: 'Listen to the talk', hi: 'बातचीत सुनो' },
  story: { key: 'story', en: 'Read the story', hi: 'कहानी पढ़ो' },
  listenPick: { key: 'listenPick', en: 'Listen and choose the picture', hi: 'सुनो और सही चित्र चुनो' },
  readPick: { key: 'readPick', en: 'Read and choose the picture', hi: 'पढ़ो और सही चित्र चुनो' },
  pictureWord: { key: 'pictureWord', en: 'Choose the word for the picture', hi: 'चित्र के लिए सही शब्द चुनो' },
  meaning: { key: 'meaning', en: 'What does this word mean?', hi: 'इस शब्द का मतलब क्या है?' },
  letterPick: { key: 'letterPick', en: 'Listen and choose the letter', hi: 'सुनो और सही अक्षर चुनो' },
  keyLetter: { key: 'keyLetter', en: 'Which letter does it start with?', hi: 'यह शब्द किस अक्षर से शुरू होता है?' },
  caseMatch: { key: 'caseMatch', en: 'Find the small letter', hi: 'इसका छोटा अक्षर ढूँढो' },
  hearWord: { key: 'hearWord', en: 'Listen and choose the word', hi: 'सुनो और सही शब्द चुनो' },
  fillBlank: { key: 'fillBlank', en: 'Choose the missing word', hi: 'खाली जगह के लिए सही शब्द चुनो' },
  listenScene: { key: 'listenScene', en: 'Listen and choose the picture', hi: 'वाक्य सुनो और सही चित्र चुनो' },
  readScene: { key: 'readScene', en: 'Read and choose the picture', hi: 'वाक्य पढ़ो और सही चित्र चुनो' },
  pickAnswer: { key: 'pickAnswer', en: 'Listen and choose the best answer', hi: 'सवाल सुनो और सही जवाब चुनो' },
  question: { key: 'question', en: 'Answer the question', hi: 'सवाल का जवाब दो' },
  build: { key: 'build', en: 'Listen and spell the word', hi: 'सुनो और शब्द बनाओ' },
  order: { key: 'order', en: 'Put the words in order', hi: 'शब्दों को सही क्रम में लगाओ' },
  trace: { key: 'trace', en: 'Trace the letter with your finger', hi: 'उंगली से अक्षर बनाओ' },
  say: { key: 'say', en: 'Listen, then say it', hi: 'सुनो, फिर बोलो' },
  write: { key: 'write', en: 'Write your own sentence', hi: 'अपना वाक्य लिखो' },
};

function wordPool(w: Word, n: number): Word[] {
  const all = Object.values(WORDS).filter((x) => x.en !== w.en && x.emoji !== w.emoji && x.hi !== w.hi);
  const same = shuffle(all.filter((x) => x.cat === w.cat));
  const other = shuffle(all.filter((x) => x.cat !== w.cat));
  const out: Word[] = [];
  const seen = new Set([w.emoji, w.hi, w.en]);
  for (const x of [...same, ...other]) {
    if (seen.has(x.emoji) || seen.has(x.hi) || seen.has(x.en)) continue;
    seen.add(x.emoji);
    seen.add(x.hi);
    seen.add(x.en);
    out.push(x);
    if (out.length >= n) break;
  }
  return out;
}

function letterPool(ch: string, n: number) {
  return sample(LETTERS.map((l) => l.ch).filter((c) => c !== ch), n);
}

const buildable = (s: string) => /^[a-z]{2,7}$/.test(s);

// ---------------------------------------------------------------- step makers

export type Ctx = { level: number; nOpt: number; phase: Phase };

export const mk = {
  listenPick(w: Word, c: Ctx): Step {
    const { options, answer } = withAnswer(w, wordPool(w, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'listening', item: `w:${w.en}`, ins: INS.listenPick, kind: 'choice',
      prompt: { audio: [[w.en, 'en']] },
      options: options.map((o) => ({ emoji: o.emoji, style: 'emoji' })), answer,
    };
  },
  readPick(w: Word, c: Ctx): Step {
    const { options, answer } = withAnswer(w, wordPool(w, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'reading', item: `w:${w.en}`, ins: INS.readPick, kind: 'choice',
      prompt: { text: w.en, big: 'word' },
      options: options.map((o) => ({ emoji: o.emoji, style: 'emoji' })), answer,
    };
  },
  pictureWord(w: Word, c: Ctx): Step {
    const { options, answer } = withAnswer(w, wordPool(w, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'vocabulary', item: `w:${w.en}`, ins: INS.pictureWord, kind: 'choice',
      prompt: { emoji: w.emoji, audio: c.phase === 'check' ? undefined : [[w.en, 'en']] },
      options: options.map((o) => ({ label: o.en, say: o.en, style: 'text' })), answer,
    };
  },
  meaning(w: Word, c: Ctx): Step {
    const { options, answer } = withAnswer(w, wordPool(w, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'comprehension', item: `w:${w.en}`, ins: INS.meaning, kind: 'choice',
      prompt: { text: w.en, big: 'word' },
      options: options.map((o) => ({ label: o.hi, say: undefined, style: 'hindi' })), answer,
    };
  },
  letterPick(ch: string, c: Ctx): Step {
    const { options, answer } = withAnswer(ch, letterPool(ch, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'reading', item: `l:${ch}`, ins: INS.letterPick, kind: 'choice',
      prompt: { audio: [[ch.toUpperCase(), 'en']] },
      options: options.map((o) => ({ label: Math.random() < 0.5 ? o.toUpperCase() : o, style: 'letter' })), answer,
    };
  },
  keyLetter(ch: string, c: Ctx): Step {
    const w = WORDS[LETTER_MAP[ch].word];
    const { options, answer } = withAnswer(ch, letterPool(ch, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'listening', item: `l:${ch}`, ins: INS.keyLetter, kind: 'choice',
      prompt: { emoji: w.emoji, audio: [[w.en, 'en']] },
      options: options.map((o) => ({ label: o, say: o.toUpperCase(), style: 'letter' })), answer,
    };
  },
  firstSound(w: Word, c: Ctx): Step {
    const ch = w.en[0];
    const { options, answer } = withAnswer(ch, letterPool(ch, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'listening', item: `w:${w.en}`, ins: INS.keyLetter, kind: 'choice',
      prompt: { emoji: w.emoji, audio: [[w.en, 'en']] },
      options: options.map((o) => ({ label: o, say: o.toUpperCase(), style: 'letter' })), answer,
    };
  },
  caseMatch(ch: string, c: Ctx): Step {
    const { options, answer } = withAnswer(ch, letterPool(ch, c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'reading', item: `l:${ch}`, ins: INS.caseMatch, kind: 'choice',
      prompt: { text: ch.toUpperCase(), big: 'letter' },
      options: options.map((o) => ({ label: o, style: 'letter' })), answer,
    };
  },
  hearWord(word: string, pool: string[], c: Ctx, item: string, skill: Skill = 'reading'): Step {
    const { options, answer } = withAnswer(word, sample([...new Set(pool)].filter((x) => x.toLowerCase() !== word.toLowerCase()), c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill, item, ins: INS.hearWord, kind: 'choice',
      prompt: { audio: [[word, 'en']] },
      options: options.map((o) => ({ label: o, style: 'text' })), answer,
    };
  },
  fillBlank(sentence: string, blank: string, pool: string[], c: Ctx, item: string, hi?: string): Step {
    const re = new RegExp(`\\b${blank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    const text = sentence.replace(re, '____');
    const { options, answer } = withAnswer(blank, sample([...new Set(pool)].filter((x) => x.toLowerCase() !== blank.toLowerCase()), c.nOpt - 1));
    return {
      id: nid(), phase: c.phase, skill: 'comprehension', item, ins: INS.fillBlank, kind: 'choice',
      prompt: { text, big: 'sentence', hi },
      options: options.map((o) => ({ label: o, style: 'text' })), answer,
    };
  },
  scene(sentId: string, c: Ctx, mode: 'listen' | 'read'): Step {
    const s = SENTENCES[sentId];
    const others = sample(Object.values(SENTENCES).filter((x) => x.id !== sentId && x.scene !== s.scene), c.nOpt - 1);
    const { options, answer } = withAnswer(s, others);
    return {
      id: nid(), phase: c.phase, skill: mode === 'listen' ? 'listening' : 'reading', item: `s:${sentId}`,
      ins: mode === 'listen' ? INS.listenScene : INS.readScene, kind: 'choice',
      prompt: mode === 'listen' ? { audio: [[s.en, 'en']] } : { text: s.en, big: 'sentence' },
      options: options.map((o) => ({ emoji: o.scene, style: 'emoji' })), answer,
    };
  },
  pickAnswer(dId: string, c: Ctx): Step {
    const d = DIALOGUES[dId];
    const others = sample(Object.values(DIALOGUES).filter((x) => x.id !== dId), c.nOpt - 1);
    const { options, answer } = withAnswer(d, others);
    return {
      id: nid(), phase: c.phase, skill: 'listening', item: `d:${dId}`, ins: INS.pickAnswer, kind: 'choice',
      prompt: { audio: [[d.q, 'en']], text: c.level >= 4 || c.phase !== 'check' ? d.q : undefined, big: 'sentence', hi: d.qhi },
      options: options.map((o) => ({ label: o.a, say: o.a, style: 'answer' })), answer,
    };
  },
  question(q: Question, pid: string, c: Ctx, i: number): Step {
    const idx = q.options.map((_, k) => k);
    const order = shuffle(idx);
    return {
      id: nid(), phase: c.phase, skill: 'comprehension', item: `p:${pid}#${i}`, ins: INS.question, kind: 'choice',
      prompt: { text: q.q, big: 'sentence', audio: [[q.q, 'en']], hi: q.qhi },
      options: order.map((k) => ({ label: q.options[k], emoji: q.emoji?.[k], say: q.options[k], style: 'answer' })),
      answer: order.indexOf(q.answer),
    };
  },
  build(w: Word, c: Ctx, extra = 2): Step {
    const letters = w.en.split('');
    const dist = c.nOpt <= 2 ? [] : letterPool('', 30).filter((x) => !letters.includes(x)).slice(0, extra);
    return {
      id: nid(), phase: c.phase, skill: 'writing', item: `w:${w.en}`, ins: INS.build, kind: 'build',
      word: w.en, emoji: w.emoji, hi: w.hi, tiles: shuffle([...letters, ...dist]),
    };
  },
  order(text: string, c: Ctx, item: string, hi?: string, scene?: string): Step {
    const tiles = text.replace(/[.?!,]/g, '').split(/\s+/);
    let sh = shuffle(tiles);
    for (let k = 0; k < 5 && sh.join(' ') === tiles.join(' ') && tiles.length > 1; k++) sh = shuffle(tiles);
    return { id: nid(), phase: c.phase, skill: 'writing', item, ins: INS.order, kind: 'order', sentence: text, hi, scene, tiles: sh };
  },
  trace(ch: string, c: Ctx): Step {
    return { id: nid(), phase: c.phase, skill: 'writing', item: `l:${ch}`, ins: INS.trace, kind: 'trace', ch };
  },
  say(text: string, c: Ctx, item: string, hi?: string, emoji?: string): Step {
    return { id: nid(), phase: c.phase, skill: 'speaking', item, ins: INS.say, kind: 'say', text, hi, emoji };
  },
};

// ---------------------------------------------------------------- review step (used by warm-up, practice, checkpoints, tests)

export function reviewStep(key: string, level: number, phase: Phase, nOpt = 3): Step | null {
  const c: Ctx = { level, nOpt, phase };
  const [t, id] = [key.slice(0, 1), key.slice(2)];
  if (t === 'w' && WORDS[id]) {
    const w = WORDS[id];
    if (level <= 1) return Math.random() < 0.7 || !buildable(w.en) ? mk.listenPick(w, c) : mk.build(w, c);
    const r = Math.random();
    if (r < 0.35) return mk.readPick(w, c);
    if (r < 0.6) return mk.meaning(w, c);
    if (r < 0.8 && buildable(w.en)) return mk.build(w, c);
    return mk.listenPick(w, c);
  }
  if (t === 'l' && LETTER_MAP[id]) return Math.random() < 0.5 ? mk.letterPick(id, c) : mk.keyLetter(id, c);
  if (t === 'g' && SIGHT[id]) return mk.hearWord(id, Object.keys(SIGHT), c, key);
  if (t === 's' && SENTENCES[id]) {
    const r = Math.random();
    if (r < 0.4) return mk.scene(id, c, 'read');
    if (r < 0.7) return mk.scene(id, c, 'listen');
    return mk.order(SENTENCES[id].en, c, key);
  }
  if (t === 'd' && DIALOGUES[id]) return mk.pickAnswer(id, c);
  if (t === 'p') {
    const [pid, qi] = id.split('#');
    const p = PASSAGES[pid];
    if (p && p.questions[+qi]) return mk.question(p.questions[+qi], pid, c, +qi);
  }
  return null;
}

// ---------------------------------------------------------------- lesson generator

export function dueItems(p: Profile, limit: number, exclude: string[] = []): string[] {
  const t = today();
  const ex = new Set(exclude);
  return Object.entries(p.items)
    .filter(([k, s]) => s.due <= t && !ex.has(k))
    .sort((a, b) => a[1].box - b[1].box || a[1].due.localeCompare(b[1].due))
    .slice(0, limit)
    .map(([k]) => k);
}

export function weakItems(p: Profile, limit: number): string[] {
  return Object.entries(p.items)
    .filter(([, s]) => s.wrong > 0 || s.box <= 1)
    .sort((a, b) => b[1].wrong - b[1].right - (a[1].wrong - a[1].right))
    .slice(0, limit)
    .map(([k]) => k);
}

export function isEasyMode(p: Profile, lesson: Lesson) {
  return (p.lessons[lesson.id]?.fails ?? 0) >= 2;
}

export function generateLesson(p: Profile, lesson: Lesson): Step[] {
  const easy = isEasyMode(p, lesson);
  const level = lesson.level;
  const nOpt = easy ? 2 : level === 1 ? 3 : 4;
  const C = (phase: Phase): Ctx => ({ level, nOpt, phase });
  const steps: Step[] = [];

  // Warm-up: recall from earlier lessons (spaced repetition)
  if (lesson.kind !== 'checkpoint') {
    for (const k of dueItems(p, 3, lesson.items)) {
      const s = reviewStep(k, Math.min(level, p.level), 'warmup', nOpt);
      if (s) steps.push(s);
    }
  }

  const items = lesson.items;
  switch (lesson.kind) {
    case 'letters': {
      const chs = items.map((k) => k.slice(2));
      chs.forEach((ch) => steps.push({ id: nid(), phase: 'learn', skill: 'reading', item: `l:${ch}`, ins: INS.teachLetter, kind: 'teachLetter', ch }));
      shuffle(chs).forEach((ch) => steps.push(mk.letterPick(ch, C('practice'))));
      shuffle(chs).forEach((ch) => steps.push(mk.keyLetter(ch, C('practice'))));
      chs.forEach((ch) => steps.push(mk.trace(ch, C('apply'))));
      shuffle(chs).forEach((ch) => steps.push(mk.caseMatch(ch, C('apply'))));
      steps.push(mk.say(chs.map((ch) => `${ch.toUpperCase()} for ${LETTER_MAP[ch].word}`).join('. '), C('apply'), `l:${chs[0]}`));
      shuffle(chs).forEach((ch, i) => steps.push(i % 2 ? mk.keyLetter(ch, C('check')) : mk.letterPick(ch, C('check'))));
      shuffle(chs).forEach((ch) => steps.push(mk.caseMatch(ch, C('check'))));
      break;
    }
    case 'vocab': {
      const ws = items.map((k) => WORDS[k.slice(2)]);
      ws.forEach((w) => steps.push({ id: nid(), phase: 'learn', skill: 'vocabulary', item: `w:${w.en}`, ins: INS.teach, kind: 'teachWord', word: w }));
      shuffle(ws).forEach((w) => steps.push(mk.listenPick(w, C('practice'))));
      shuffle(ws).forEach((w) => steps.push(mk.pictureWord(w, C('practice'))));
      if (level >= 2) shuffle(ws).slice(0, 3).forEach((w) => steps.push(mk.meaning(w, C('practice'))));
      if (level === 1) sample(ws, 2).forEach((w) => steps.push(mk.firstSound(w, C('apply'))));
      sample(ws.filter((w) => buildable(w.en) && w.en.length <= (level === 1 ? 4 : 7)), 2).forEach((w) => steps.push(mk.build(w, C('apply'))));
      sample(ws, 2).forEach((w) => steps.push(mk.say(w.en, C('apply'), `w:${w.en}`, w.hi, w.emoji)));
      shuffle(ws).forEach((w) =>
        steps.push(level === 1 ? mk.listenPick(w, C('check')) : Math.random() < 0.5 ? mk.readPick(w, C('check')) : mk.meaning(w, C('check'))),
      );
      break;
    }
    case 'phonics': {
      const ws = items.map((k) => WORDS[k.slice(2)]);
      ws.forEach((w) => steps.push({ id: nid(), phase: 'learn', skill: 'reading', item: `w:${w.en}`, ins: INS.blend, kind: 'teachBlend', word: w }));
      shuffle(ws).forEach((w) => steps.push(mk.readPick(w, C('practice'))));
      shuffle(ws).slice(0, 3).forEach((w) => steps.push(mk.firstSound(w, C('practice'))));
      shuffle(ws).forEach((w) => steps.push(mk.build(w, C('apply'))));
      sample(ws, 2).forEach((w) => steps.push(mk.say(w.en, C('apply'), `w:${w.en}`, w.hi, w.emoji)));
      shuffle(ws).forEach((w) => steps.push(mk.readPick(w, C('check'))));
      sample(ws, 2).forEach((w) => steps.push(mk.build(w, C('check'))));
      break;
    }
    case 'sight': {
      const gs = items.map((k) => k.slice(2));
      const pool = Object.keys(SIGHT);
      gs.forEach((x) => steps.push({ id: nid(), phase: 'learn', skill: 'reading', item: `g:${x}`, ins: INS.sight, kind: 'teachSight', sight: x }));
      shuffle(gs).forEach((x) => steps.push(mk.hearWord(x, pool, C('practice'), `g:${x}`)));
      shuffle(gs).forEach((x) => steps.push(mk.fillBlank(SIGHT[x].example, x, pool, C('apply'), `g:${x}`, SIGHT[x].exampleHi)));
      sample(gs, 2).forEach((x) => steps.push(mk.say(SIGHT[x].example, C('apply'), `g:${x}`, SIGHT[x].exampleHi)));
      shuffle(gs).forEach((x) => steps.push(mk.hearWord(x, pool, C('check'), `g:${x}`)));
      sample(gs, 2).forEach((x) => steps.push(mk.fillBlank(SIGHT[x].example, x, pool, C('check'), `g:${x}`)));
      break;
    }
    case 'sentences': {
      const ss = items.map((k) => SENTENCES[k.slice(2)]);
      const blanks = Object.values(SENTENCES).map((x) => x.blank!).filter(Boolean);
      ss.forEach((x) => steps.push({ id: nid(), phase: 'learn', skill: 'reading', item: `s:${x.id}`, ins: INS.sentence, kind: 'teachSentence', en: x.en, hi: x.hi, scene: x.scene }));
      shuffle(ss).forEach((x) => steps.push(mk.scene(x.id, C('practice'), 'listen')));
      shuffle(ss).slice(0, 3).forEach((x) => steps.push(mk.fillBlank(x.en, x.blank!, blanks, C('practice'), `s:${x.id}`, x.hi)));
      shuffle(ss).slice(0, 3).forEach((x) => steps.push(mk.order(x.en, C('apply'), `s:${x.id}`, x.hi, x.scene)));
      sample(ss, 2).forEach((x) => steps.push(mk.say(x.en, C('apply'), `s:${x.id}`, x.hi, x.scene)));
      shuffle(ss).forEach((x) => steps.push(mk.scene(x.id, C('check'), 'read')));
      sample(ss, 2).forEach((x) => steps.push(mk.order(x.en, C('check'), `s:${x.id}`)));
      break;
    }
    case 'talk': {
      const ds = items.map((k) => DIALOGUES[k.slice(2)]);
      ds.forEach((x) => steps.push({ id: nid(), phase: 'learn', skill: 'listening', item: `d:${x.id}`, ins: INS.dialogue, kind: 'teachDialogue', q: x.q, qhi: x.qhi, a: x.a, ahi: x.ahi, scene: x.scene }));
      shuffle(ds).forEach((x) => steps.push(mk.pickAnswer(x.id, C('practice'))));
      shuffle(ds).forEach((x) => steps.push(mk.order(x.a, C('apply'), `d:${x.id}`, x.ahi, x.scene)));
      ds.forEach((x) => steps.push(mk.say(x.a, C('apply'), `d:${x.id}`, x.ahi, x.scene)));
      shuffle(ds).forEach((x) => steps.push(mk.pickAnswer(x.id, C('check'))));
      break;
    }
    case 'story': {
      const pid = items[0].slice(2);
      const ps = PASSAGES[pid];
      steps.push({ id: nid(), phase: 'learn', skill: 'reading', item: `p:${pid}#0`, ins: INS.story, kind: 'readAlong', passageId: pid });
      // Practice: sentence-level understanding of story lines
      sample(ps.lines, 2).forEach((ln) => {
        const others = sample(Object.values(SENTENCES).filter((x) => x.scene !== ln.scene), nOpt - 1).map((x) => ({ emoji: x.scene }));
        const { options, answer } = withAnswer({ emoji: ln.scene }, others);
        steps.push({
          id: nid(), phase: 'practice', skill: 'reading', item: `p:${pid}#0`, ins: INS.readScene, kind: 'choice',
          prompt: { text: ln.en, big: 'sentence', audio: easy ? [[ln.en, 'en']] : undefined },
          options: options.map((o) => ({ emoji: o.emoji, style: 'emoji' })), answer,
        });
      });
      const line = sample(ps.lines.filter((x) => x.en.split(' ').length <= 8), 1)[0] ?? ps.lines[0];
      steps.push(mk.order(line.en, C('apply'), `p:${pid}#0`, line.hi, line.scene));
      steps.push(mk.say(sample(ps.lines, 1)[0].en, C('apply'), `p:${pid}#0`));
      ps.questions.forEach((q, i) => steps.push(mk.question(q, pid, C('check'), i)));
      if (ps.writePrompt)
        steps.push({ id: nid(), phase: 'apply', skill: 'writing', item: `p:${pid}#0`, ins: INS.write, kind: 'write', promptEn: ps.writePrompt.en, promptHi: ps.writePrompt.hi });
      break;
    }
    case 'checkpoint': {
      const keys = levelLessons(level)
        .filter((x) => x.kind !== 'checkpoint')
        .flatMap((x) => (x.kind === 'story' ? PASSAGES[x.items[0].slice(2)].questions.map((_, i) => `${x.items[0]}#${i}`) : x.items));
      // weight toward weaker items
      const scored = shuffle(keys).sort((a, b) => (p.items[a]?.box ?? 0) - (p.items[b]?.box ?? 0));
      const pick = shuffle([...scored.slice(0, 7), ...sample(scored.slice(7), 5)]);
      for (const k of pick) {
        const s = reviewStep(k, level, 'check', nOpt);
        if (s) steps.push(s);
      }
      break;
    }
  }
  return steps;
}

// ---------------------------------------------------------------- results

const INTERVALS = [1, 2, 4, 7, 14, 30];

export function updateItem(stat: ItemStat | undefined, correct: boolean, independent: boolean): ItemStat {
  const s: ItemStat = stat ?? { box: 0, due: today(), seen: 0, right: 0, wrong: 0 };
  const n = { ...s, seen: s.seen + 1, last: today() };
  if (correct && independent) {
    n.right++;
    n.box = Math.min(5, s.box + 1);
  } else if (correct) {
    n.right++;
  } else {
    n.wrong++;
    n.box = 0;
  }
  n.due = addDays(today(), INTERVALS[n.box]);
  return n;
}

export interface LessonOutcome {
  accuracy: number; // check accuracy 0..100 (independent only)
  passed: boolean;
  stars: number;
  levelUp: number | null;
  newWords: string[];
}

export const PASS = 70;

export function applyResults(p: Profile, lesson: Lesson | null, results: StepResult[], seconds: number): { profile: Profile; outcome: LessonOutcome } {
  const scored = results.filter((r) => r.scored);
  const check = scored.filter((r) => r.phase === 'check');
  const indep = check.filter((r) => r.correct && !r.assisted).length;
  const accuracy = check.length ? Math.round((indep / check.length) * 100) : 100;
  const passed = accuracy >= PASS;
  const stars = !passed ? 0 : accuracy >= 90 ? 3 : accuracy >= 80 ? 2 : 1;

  const items = { ...p.items };
  const newWords: string[] = [];
  for (const r of scored) {
    if (!items[r.item] && r.correct) newWords.push(r.item);
    items[r.item] = updateItem(items[r.item], r.correct, !r.assisted);
  }
  const skills = { ...p.skills };
  for (const r of scored) {
    if (r.phase === 'learn') continue;
    skills[r.skill] = [...(skills[r.skill] ?? []), r.correct && !r.assisted ? 1 : 0].slice(-40);
  }

  const t = today();
  const daily = { ...p.daily, [t]: { sec: (p.daily[t]?.sec ?? 0) + seconds, lessons: (p.daily[t]?.lessons ?? 0) + (lesson ? 1 : 0) } };

  let lessons = p.lessons;
  let level = p.level;
  let levelUp: number | null = null;
  if (lesson) {
    const prev = p.lessons[lesson.id] ?? { stars: 0, best: 0, attempts: 0, fails: 0 };
    lessons = {
      ...p.lessons,
      [lesson.id]: {
        stars: Math.max(prev.stars, stars),
        best: Math.max(prev.best, accuracy),
        attempts: prev.attempts + 1,
        fails: passed ? 0 : prev.fails + 1,
        doneAt: passed ? prev.doneAt ?? t : prev.doneAt,
      },
    };
    if (passed && lesson.kind === 'checkpoint' && lesson.level === p.level && p.level < 4) {
      level = p.level + 1;
      levelUp = level;
    }
  }
  return {
    profile: { ...p, items, skills, daily, lessons, level },
    outcome: { accuracy, passed, stars, levelUp, newWords: [...new Set(newWords)] },
  };
}

// ---------------------------------------------------------------- progress queries

export function lessonState(p: Profile, lesson: Lesson): 'done' | 'open' | 'locked' {
  if (p.lessons[lesson.id]?.stars) return 'done';
  if (lesson.level > p.level) return 'locked';
  const list = levelLessons(lesson.level);
  const i = list.findIndex((x) => x.id === lesson.id);
  // Lessons of levels below where you were placed are open for review
  if (lesson.level < p.startLevel) return 'open';
  if (i === 0) return 'open';
  return p.lessons[list[i - 1].id]?.stars ? 'open' : 'locked';
}

export function nextLesson(p: Profile): Lesson | null {
  for (const lv of LEVELS) {
    if (lv.n < p.startLevel && lv.n < p.level) continue;
    if (lv.n > p.level) break;
    for (const l of levelLessons(lv.n)) {
      if (lessonState(p, l) === 'open') return l;
    }
  }
  return null;
}

export function skillScore(p: Profile, s: Skill): number | null {
  const h = p.skills[s] ?? [];
  if (h.length < 3) return null;
  const recent = h.slice(-20);
  return Math.round((recent.reduce((a, b) => a + b, 0) / recent.length) * 100);
}

export function lessonsDone(p: Profile) {
  return Object.values(p.lessons).filter((x) => x.stars > 0).length;
}

export function totalStars(p: Profile) {
  return Object.values(p.lessons).reduce((a, x) => a + x.stars, 0);
}

export function wordsKnown(p: Profile) {
  return Object.entries(p.items).filter(([k, s]) => (k.startsWith('w:') || k.startsWith('g:')) && s.box >= 1 && s.right > 0).length;
}

export function streak(p: Profile) {
  let n = 0;
  let d = today();
  if (!p.daily[d]?.lessons) d = addDays(d, -1);
  while (p.daily[d]?.lessons) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function stuckLessons(p: Profile): Lesson[] {
  return Object.entries(p.lessons)
    .filter(([, r]) => r.fails >= 2 && !r.stars)
    .map(([id]) => LESSON_MAP[id])
    .filter(Boolean);
}

export function testPct(t: TestResult | undefined, s: Skill): number | null {
  const x = t?.scores[s];
  if (!x || !x.total) return null;
  return Math.round((x.right / x.total) * 100);
}

export function emptyScores(): TestResult['scores'] {
  return Object.fromEntries(SKILLS.map((k) => [k, { right: 0, total: 0 }])) as TestResult['scores'];
}

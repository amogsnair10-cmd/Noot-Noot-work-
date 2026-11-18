// Placement (baseline) and final (endline) tests.
// Form A and Form B test the same skills with different, equivalent items,
// so the final test checks real learning, not memory of the first test.

import { PASSAGES, SENTENCES } from '../content/sentences';
import type { Skill } from '../content/types';
import { WORDS } from '../content/words';
import type { Step, StepResult } from './engine';
import { emptyScores, mk } from './engine';
import type { TestResult } from './store';
import { today } from './store';

interface Form {
  letters: string[];
  listen: string[];
  read: string[];
  meaning: string[];
  build: string[];
  readScene: string[];
  order: string;
  listenScene: string[];
  passage: string;
  talk: string[];
  sayWord: string;
  saySentence: string;
}

const FORMS: Record<'A' | 'B', Form> = {
  A: {
    letters: ['b', 'm', 's', 't'],
    listen: ['dog', 'apple', 'hand', 'bus'],
    read: ['cat', 'sun', 'pig', 'bed'],
    meaning: ['water', 'happy', 'school'],
    build: ['dog', 'map'],
    readScene: ['this-cat', 'cat-box', 'can-run'],
    order: 'I have a book.',
    listenScene: ['drink-water', 'she-sad'],
    passage: 'testA',
    talk: ['how', 'what-this'],
    sayWord: 'hello',
    saySentence: 'I am happy.',
  },
  B: {
    letters: ['d', 'p', 'r', 'f'],
    listen: ['cow', 'banana', 'eye', 'car'],
    read: ['hat', 'cup', 'box', 'hen'],
    meaning: ['milk', 'big', 'shop'],
    build: ['pen', 'bus'],
    readScene: ['it-hot', 'bird-tree', 'eat-rice'],
    order: 'I like mango.',
    listenScene: ['go-school', 'am-happy'],
    passage: 'testB',
    talk: ['name', 'live'],
    sayWord: 'thank you',
    saySentence: 'I go to school.',
  },
};

export const STAGES = [
  { en: 'Letters and words', hi: 'अक्षर और शब्द', emoji: '🔤' },
  { en: 'Reading words', hi: 'शब्द पढ़ना', emoji: '📖' },
  { en: 'Sentences', hi: 'वाक्य', emoji: '💬' },
  { en: 'Story', hi: 'कहानी', emoji: '📚' },
];

export function stageSteps(form: 'A' | 'B', stage: number): Step[] {
  const f = FORMS[form];
  const c = (level: number) => ({ level, nOpt: 3, phase: 'check' as const });
  switch (stage) {
    case 0:
      return [
        ...f.letters.map((ch) => mk.letterPick(ch, c(1))),
        ...f.listen.map((w) => mk.listenPick(WORDS[w], c(1))),
        mk.say(f.sayWord, c(1), `w:${f.sayWord}`, WORDS[f.sayWord]?.hi, WORDS[f.sayWord]?.emoji),
      ];
    case 1:
      return [
        ...f.read.map((w) => mk.readPick(WORDS[w], c(2))),
        ...f.meaning.map((w) => mk.meaning(WORDS[w], c(2))),
        ...f.build.map((w) => mk.build(WORDS[w], c(2))),
      ];
    case 2:
      return [
        ...f.readScene.map((id) => mk.scene(id, c(3), 'read')),
        mk.order(f.order, c(3), 'test:order'),
        ...f.listenScene.map((id) => mk.scene(id, c(3), 'listen')),
        mk.say(f.saySentence, c(3), 'test:say'),
      ];
    case 3: {
      const p = PASSAGES[f.passage];
      return [
        { id: `rd-${form}`, phase: 'check', skill: 'reading', item: `p:${f.passage}#0`, ins: { key: 'story', en: 'Read the story', hi: 'कहानी पढ़ो' }, kind: 'readAlong', passageId: f.passage },
        ...p.questions.map((q, i) => mk.question(q, f.passage, c(4), i)),
        ...f.talk.map((d) => mk.pickAnswer(d, c(4))),
      ];
    }
  }
  return [];
}

/** Stage passed if ≥ 60% of its scored items were right on the first try. */
export function stagePassed(results: StepResult[]) {
  const s = results.filter((r) => r.scored);
  if (!s.length) return false;
  return s.filter((r) => r.correct && !r.assisted).length / s.length >= 0.6;
}

export function scoreTest(form: 'A' | 'B', all: StepResult[], stagesPassed: number): TestResult {
  const scores = emptyScores();
  for (const r of all) {
    if (!r.scored) continue;
    const k: Skill = r.skill;
    scores[k].total++;
    if (r.correct && !r.assisted) scores[k].right++;
  }
  return { date: today(), form, level: Math.min(4, 1 + stagesPassed), scores };
}

export const SENTENCE_IDS = Object.keys(SENTENCES);

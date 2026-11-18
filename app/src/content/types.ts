export type Skill = 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'comprehension';

export const SKILLS: Skill[] = ['listening', 'speaking', 'reading', 'writing', 'vocabulary', 'comprehension'];

export const SKILL_INFO: Record<Skill, { en: string; hi: string; icon: string; color: string }> = {
  listening: { en: 'Listening', hi: 'सुनना', icon: '👂', color: '#22D3EE' },
  speaking: { en: 'Speaking', hi: 'बोलना', icon: '🗣️', color: '#FF6FA8' },
  reading: { en: 'Reading', hi: 'पढ़ना', icon: '📖', color: '#A78BFA' },
  writing: { en: 'Writing', hi: 'लिखना', icon: '✍️', color: '#FFA94D' },
  vocabulary: { en: 'Words', hi: 'शब्द', icon: '🧠', color: '#5BA2FF' },
  comprehension: { en: 'Understanding', hi: 'समझना', icon: '💡', color: '#FFD84D' },
};

export interface Word {
  en: string;
  hi: string;
  emoji: string;
  cat: string;
}

export interface Letter {
  ch: string; // lowercase
  word: string; // keyword (must exist in words)
}

export interface Sentence {
  id: string;
  en: string;
  hi: string;
  scene: string; // emoji picture of the sentence
  blank?: string; // the word to blank out in fill-in-the-gap
}

export interface Dialogue {
  id: string;
  q: string;
  qhi: string;
  a: string;
  ahi: string;
  scene: string;
}

export interface Question {
  q: string;
  qhi: string;
  options: string[];
  emoji?: string[];
  answer: number;
}

export interface Passage {
  id: string;
  title: string;
  titleHi: string;
  emoji: string;
  lines: { en: string; hi: string; scene: string }[];
  questions: Question[];
  writePrompt?: { en: string; hi: string };
}

export type LessonKind = 'letters' | 'vocab' | 'phonics' | 'sight' | 'sentences' | 'talk' | 'story' | 'checkpoint';

export interface Lesson {
  id: string;
  level: number;
  title: string;
  titleHi: string;
  emoji: string;
  kind: LessonKind;
  items: string[];
}

export interface Unit {
  id: string;
  title: string;
  titleHi: string;
  emoji: string;
  lessons: Lesson[];
}

export interface Level {
  n: number;
  key: 'pre' | 'emergent' | 'potential' | 'high';
  name: string;
  nameHi: string;
  stage: string;
  stageHi: string;
  emoji: string;
  color: string;
  goal: string;
  goalHi: string;
  units: Unit[];
}

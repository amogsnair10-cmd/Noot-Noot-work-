export type Skill = 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'comprehension';

export const SKILLS: Skill[] = ['listening', 'speaking', 'reading', 'writing', 'vocabulary', 'comprehension'];

export const SKILL_INFO: Record<Skill, { en: string; hi: string; icon: string; color: string }> = {
  listening: { en: 'Listening', hi: 'सुनना', icon: '👂', color: '#12A39A' },
  speaking: { en: 'Speaking', hi: 'बोलना', icon: '🗣️', color: '#E8457C' },
  reading: { en: 'Reading', hi: 'पढ़ना', icon: '📖', color: '#6C4CF1' },
  writing: { en: 'Writing', hi: 'लिखना', icon: '✍️', color: '#FF7A1A' },
  vocabulary: { en: 'Words', hi: 'शब्द', icon: '🧠', color: '#2F80ED' },
  comprehension: { en: 'Understanding', hi: 'समझना', icon: '💡', color: '#D9A400' },
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

import { useSyncExternalStore } from 'react';
import type { Skill } from '../content/types';
import { SKILLS } from '../content/types';

export interface ItemStat {
  box: number; // 0..5 spaced-repetition box
  due: string; // YYYY-MM-DD
  seen: number;
  right: number;
  wrong: number;
  last?: string;
}

export interface LessonRecord {
  stars: number; // 0 = not passed yet
  best: number; // best check accuracy 0..100
  attempts: number;
  fails: number;
  doneAt?: string;
}

export interface TestResult {
  date: string;
  form: 'A' | 'B';
  level: number;
  scores: Record<Skill, { right: number; total: number }>;
}

export interface Writing {
  date: string;
  prompt: string;
  text: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  age: 'child' | 'teen' | 'adult';
  createdAt: string;
  level: number; // highest unlocked level (1..4)
  startLevel: number;
  placement?: TestResult;
  endline?: TestResult;
  retention?: { date: string; right: number; total: number };
  lessons: Record<string, LessonRecord>;
  items: Record<string, ItemStat>;
  skills: Record<Skill, number[]>; // recent independent outcomes (1/0), newest last
  daily: Record<string, { sec: number; lessons: number }>;
  speakingRubric?: number; // teacher-scored 0..4
  writings: Writing[];
  extraTimeDate?: string; // teacher allowed extra time on this date
}

export interface Settings {
  dailyLimitMin: number;
  goalMin: number;
  slowSpeech: boolean;
  sound: boolean;
  teacherPin: string;
}

export interface AppState {
  v: 1;
  profiles: Profile[];
  activeId: string | null;
  settings: Settings;
}

const KEY = 'akshar-english-v1';

const DEFAULT: AppState = {
  v: 1,
  profiles: [],
  activeId: null,
  settings: { dailyLimitMin: 60, goalMin: 25, slowSpeech: false, sound: true, teacherPin: '1234' },
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as AppState;
      return { ...DEFAULT, ...s, settings: { ...DEFAULT.settings, ...s.settings } };
    }
  } catch {
    /* storage blocked or corrupt */
  }
  return structuredClone(DEFAULT);
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getState() {
  return state;
}

export function setState(fn: (s: AppState) => AppState) {
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

export function updateProfile(id: string, fn: (p: Profile) => Profile) {
  setState((s) => ({ ...s, profiles: s.profiles.map((p) => (p.id === id ? fn(p) : p)) }));
}

export function activeProfile(s: AppState = state): Profile | null {
  return s.profiles.find((p) => p.id === s.activeId) ?? null;
}

export function today(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(date: string, n: number) {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
}

export function daysBetween(a: string, b: string) {
  return Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86400000);
}

export function newProfile(name: string, avatar: string, age: Profile['age']): Profile {
  return {
    id: Math.random().toString(36).slice(2, 10),
    name,
    avatar,
    age,
    createdAt: today(),
    level: 1,
    startLevel: 1,
    lessons: {},
    items: {},
    skills: Object.fromEntries(SKILLS.map((k) => [k, []])) as unknown as Record<Skill, number[]>,
    daily: {},
    writings: [],
  };
}

export function exportBackup(): string {
  return JSON.stringify(state);
}

export function importBackup(json: string): boolean {
  try {
    const s = JSON.parse(json) as AppState;
    if (!s || !Array.isArray(s.profiles)) return false;
    setState((cur) => {
      const ids = new Set(cur.profiles.map((p) => p.id));
      const merged = [...cur.profiles.map((p) => s.profiles.find((x) => x.id === p.id) ?? p), ...s.profiles.filter((p) => !ids.has(p.id))];
      return { ...cur, profiles: merged };
    });
    return true;
  } catch {
    return false;
  }
}

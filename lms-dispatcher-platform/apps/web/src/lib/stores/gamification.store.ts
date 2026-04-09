import { create } from 'zustand';
import { useAuthStore } from './auth.store';

/* ── Levels (shared with backend, mirrored for UI) ───────── */
export const LEVELS = [
  { name: 'Rookie Dispatcher',  nameRu: 'Новичок',            minXP: 0,    emoji: '🟢' },
  { name: 'Junior Dispatcher',  nameRu: 'Младший диспетчер',  minXP: 500,  emoji: '🔵' },
  { name: 'Dispatcher',         nameRu: 'Диспетчер',          minXP: 1500, emoji: '🟡' },
  { name: 'Senior Dispatcher',  nameRu: 'Старший диспетчер',  minXP: 3500, emoji: '🟠' },
  { name: 'Lead Dispatcher',    nameRu: 'Ведущий диспетчер',  minXP: 6000, emoji: '🔴' },
  { name: 'Chief Dispatcher',   nameRu: 'Главный диспетчер',  minXP: 10000,emoji: '👑' },
];

/* ── Achievement metadata (display only — server decides who has them) ── */
export interface Achievement {
  id: string;
  name: string;
  nameRu: string;
  desc: string;
  descRu: string;
  emoji: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Lessons
  { id: 'first_lesson',  name: 'First Lesson',      nameRu: 'Первый урок',         desc: 'Complete your first lesson',  descRu: 'Пройди первый урок',     emoji: '🏁' },
  { id: 'lessons_5',     name: 'Rolling',           nameRu: 'Набираю ход',         desc: 'Complete 5 lessons',          descRu: 'Пройди 5 уроков',        emoji: '🚚' },
  { id: 'lessons_10',    name: 'Road Warrior',      nameRu: 'Дорожный воин',       desc: 'Complete 10 lessons',         descRu: 'Пройди 10 уроков',       emoji: '⚔️' },
  { id: 'lessons_25',    name: 'Veteran Driver',    nameRu: 'Опытный водитель',    desc: 'Complete 25 lessons',         descRu: 'Пройди 25 уроков',       emoji: '🏅' },
  { id: 'lessons_50',    name: 'Full Haul',         nameRu: 'Полный рейс',         desc: 'Complete all 36 lessons',     descRu: 'Пройди все 36 уроков',   emoji: '🏆' },

  // Chapters
  { id: 'first_chapter', name: 'First Chapter',     nameRu: 'Первая глава',        desc: 'Complete Chapter 1',          descRu: 'Пройди главу 1',         emoji: '📦' },
  { id: 'chapters_3',    name: 'Third of the Way',  nameRu: 'Треть пути',          desc: 'Complete 3 chapters',         descRu: 'Пройди 3 главы',         emoji: '🎯' },
  { id: 'chapters_all',  name: 'Course Master',     nameRu: 'Мастер курса',        desc: 'Complete all 9 chapters',     descRu: 'Пройди все 9 глав',      emoji: '👑' },

  // Tests
  { id: 'first_test',    name: 'Tested',            nameRu: 'Протестирован',       desc: 'Pass your first test',        descRu: 'Сдай первый тест',       emoji: '✅' },
  { id: 'tests_5',       name: 'Sharp Mind',        nameRu: 'Острый ум',           desc: 'Pass 5 tests',                descRu: 'Сдай 5 тестов',          emoji: '🧠' },

  // Streaks
  { id: 'streak_3',      name: 'Consistent',        nameRu: 'Стабильный',          desc: '3-day streak',                descRu: 'Серия 3 дня',            emoji: '🔥' },
  { id: 'streak_7',      name: 'On a Roll',         nameRu: 'В ударе',             desc: '7-day streak',                descRu: 'Серия 7 дней',           emoji: '💎' },
  { id: 'streak_30',     name: 'Unstoppable',       nameRu: 'Неудержимый',         desc: '30-day streak',               descRu: 'Серия 30 дней',          emoji: '🌟' },

  // XP milestones
  { id: 'xp_1000',       name: 'Rookie No More',    nameRu: 'Уже не новичок',      desc: 'Earn 1,000 XP',               descRu: 'Набери 1000 XP',         emoji: '📈' },
  { id: 'xp_5000',       name: 'Expert',            nameRu: 'Эксперт',             desc: 'Earn 5,000 XP',               descRu: 'Набери 5000 XP',         emoji: '🎖️' },

  // Levels
  { id: 'level_5',       name: 'Level 5',           nameRu: 'Уровень 5',           desc: 'Reach level 5',               descRu: 'Достигни 5 уровня',      emoji: '⭐' },
  { id: 'level_10',      name: 'Level 10',          nameRu: 'Уровень 10',          desc: 'Reach level 10',              descRu: 'Достигни 10 уровня',     emoji: '🌠' },
];

/* ── Career milestones for progress map ─────────────────── */
export const HIGHWAY_CITIES = [
  { name: 'The Basics',     nameRu: 'Основы',         chapter: 1, emoji: '📚', short: 'Intro' },
  { name: 'Navigator',      nameRu: 'Навигатор',      chapter: 2, emoji: '🗺️', short: 'Geo' },
  { name: 'Gear Check',     nameRu: 'Техника',        chapter: 3, emoji: '🔧', short: 'Equip' },
  { name: 'Paperwork Pro',  nameRu: 'Документы',      chapter: 4, emoji: '📋', short: 'Docs' },
  { name: 'Board Hunter',   nameRu: 'Охотник',        chapter: 5, emoji: '🎯', short: 'Board' },
  { name: 'Broker Talk',    nameRu: 'Брокер',         chapter: 6, emoji: '📞', short: 'Broker' },
  { name: 'Driver Lead',    nameRu: 'Лидер',          chapter: 7, emoji: '🤝', short: 'Driver' },
  { name: 'Deal Closer',    nameRu: 'Сделки',         chapter: 8, emoji: '💰', short: 'Bid' },
  { name: 'Crisis Pro',     nameRu: 'Кризис-про',     chapter: 9, emoji: '🛡️', short: 'Crisis' },
];

/* ── Toast store (transient UI only — not persisted) ────── */
interface ToastState {
  pendingToast: { emoji: string; title: string; subtitle: string } | null;
  showToast: (toast: { emoji: string; title: string; subtitle: string }) => void;
  dismissToast: () => void;
}

export const useGamificationToast = create<ToastState>((set) => ({
  pendingToast: null,
  showToast: (toast) => set({ pendingToast: toast }),
  dismissToast: () => set({ pendingToast: null }),
}));

/* ── Gamification view hook — reads from server-side auth user ── */
export interface GamificationView {
  totalXP: number;
  streak: number;
  totalLessons: number;
  unlockedAchievements: string[];
  pendingToast: { emoji: string; title: string; subtitle: string } | null;

  startLesson: () => void;
  dismissToast: () => void;
  getLevel: () => typeof LEVELS[number];
  getLevelProgress: () => number;
}

export function useGamification(): GamificationView {
  const user = useAuthStore((s) => s.user);
  const pendingToast = useGamificationToast((s) => s.pendingToast);
  const dismissToast = useGamificationToast((s) => s.dismissToast);

  const totalXP = user?.totalXP ?? 0;
  const streak = user?.streak ?? 0;
  const unlockedAchievements = user?.achievements ?? [];

  const getLevel = () => {
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (totalXP >= l.minXP) level = l;
    }
    return level;
  };

  const getLevelProgress = () => {
    const level = getLevel();
    const idx = LEVELS.indexOf(level);
    if (idx >= LEVELS.length - 1) return 100;
    const next = LEVELS[idx + 1];
    return Math.round(((totalXP - level.minXP) / (next.minXP - level.minXP)) * 100);
  };

  return {
    totalXP,
    streak,
    totalLessons: 0, // server-driven; not used directly anymore
    unlockedAchievements,
    pendingToast,
    startLesson: () => {
      // No-op: speed bonus / lesson timing now handled server-side from lesson start event.
    },
    dismissToast,
    getLevel,
    getLevelProgress,
  };
}

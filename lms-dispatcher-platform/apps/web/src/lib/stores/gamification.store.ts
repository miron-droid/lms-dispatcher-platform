import { create } from 'zustand';

/* ── XP Values ──────────────────────────────────────────── */
const XP_PER_LESSON: Record<string, number> = {
  INTRO: 50,
  THEORY: 100,
  DEMO: 150,
  PRACTICE: 200,
  TEST: 250,
  EXAM: 500,
};
const STREAK_BONUS_MULTIPLIER = 0.1; // +10% per streak day, max 5x
const SPEED_BONUS = 25; // under 5 min

/* ── Levels ─────────────────────────────────────────────── */
export const LEVELS = [
  { name: 'Rookie Dispatcher',  nameRu: 'Новичок',            minXP: 0,    emoji: '🟢' },
  { name: 'Junior Dispatcher',  nameRu: 'Младший диспетчер',  minXP: 500,  emoji: '🔵' },
  { name: 'Dispatcher',         nameRu: 'Диспетчер',          minXP: 1500, emoji: '🟡' },
  { name: 'Senior Dispatcher',  nameRu: 'Старший диспетчер',  minXP: 3500, emoji: '🟠' },
  { name: 'Lead Dispatcher',    nameRu: 'Ведущий диспетчер',  minXP: 6000, emoji: '🔴' },
  { name: 'Chief Dispatcher',   nameRu: 'Главный диспетчер',  minXP: 10000,emoji: '👑' },
];

/* ── Achievements ───────────────────────────────────────── */
export interface Achievement {
  id: string;
  name: string;
  nameRu: string;
  desc: string;
  descRu: string;
  emoji: string;
  condition: (state: GamificationState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', name: 'First Mile', nameRu: 'Первая миля', desc: 'Complete your first lesson', descRu: 'Пройди первый урок', emoji: '🏁', condition: s => s.totalLessons >= 1 },
  { id: 'five_lessons', name: 'Rolling', nameRu: 'Набираю ход', desc: 'Complete 5 lessons', descRu: 'Пройди 5 уроков', emoji: '🚚', condition: s => s.totalLessons >= 5 },
  { id: 'ten_lessons', name: 'Road Warrior', nameRu: 'Дорожный воин', desc: 'Complete 10 lessons', descRu: 'Пройди 10 уроков', emoji: '⚔️', condition: s => s.totalLessons >= 10 },
  { id: 'all_lessons', name: 'Full Haul', nameRu: 'Полный рейс', desc: 'Complete all 36 lessons', descRu: 'Пройди все 36 уроков', emoji: '🏆', condition: s => s.totalLessons >= 36 },
  { id: 'first_chapter', name: 'First Load Booked', nameRu: 'Первый груз', desc: 'Complete Chapter 1', descRu: 'Пройди главу 1', emoji: '📦', condition: s => s.chaptersCompleted.includes(1) },
  { id: 'streak_3', name: 'Consistent', nameRu: 'Стабильный', desc: '3-day streak', descRu: 'Стрик 3 дня', emoji: '🔥', condition: s => s.streak >= 3 },
  { id: 'streak_7', name: 'On a Roll', nameRu: 'В ударе', desc: '7-day streak', descRu: 'Стрик 7 дней', emoji: '💎', condition: s => s.streak >= 7 },
  { id: 'streak_14', name: 'Unstoppable', nameRu: 'Неудержимый', desc: '14-day streak', descRu: 'Стрик 14 дней', emoji: '🌟', condition: s => s.streak >= 14 },
  { id: 'speed_demon', name: 'Speed Demon', nameRu: 'Скорость', desc: 'Finish a lesson in under 5 min', descRu: 'Пройди урок за 5 минут', emoji: '⚡', condition: s => s.speedLessons >= 1 },
  { id: 'perfect_quiz', name: 'Perfect Score', nameRu: 'Идеальный балл', desc: 'Score 100% on a quiz', descRu: 'Набери 100% в квизе', emoji: '💯', condition: s => s.perfectQuizzes >= 1 },
  { id: 'night_owl', name: 'Night Owl', nameRu: 'Ночная сова', desc: 'Study after 10 PM', descRu: 'Учись после 22:00', emoji: '🦉', condition: s => s.nightLessons >= 1 },
  { id: 'early_bird', name: 'Early Bird', nameRu: 'Ранняя пташка', desc: 'Study before 7 AM', descRu: 'Учись до 7:00', emoji: '🐦', condition: s => s.earlyLessons >= 1 },
  { id: 'geo_master', name: 'Navigator', nameRu: 'Навигатор', desc: 'Complete Geography chapter', descRu: 'Пройди главу География', emoji: '🗺️', condition: s => s.chaptersCompleted.includes(2) },
  { id: 'equipment_pro', name: 'Gear Head', nameRu: 'Знаток техники', desc: 'Complete Equipment chapter', descRu: 'Пройди главу Оборудование', emoji: '🔧', condition: s => s.chaptersCompleted.includes(3) },
  { id: 'negotiator', name: 'Negotiation Shark', nameRu: 'Акула переговоров', desc: 'Complete Bidding chapter', descRu: 'Пройди главу Торги', emoji: '🦈', condition: s => s.chaptersCompleted.includes(8) },
  { id: 'problem_solver', name: 'Crisis Manager', nameRu: 'Кризис-менеджер', desc: 'Complete Recovery chapter', descRu: 'Пройди главу Проблемы', emoji: '🛡️', condition: s => s.chaptersCompleted.includes(9) },
  { id: 'xp_1000', name: 'Rookie No More', nameRu: 'Уже не новичок', desc: 'Earn 1,000 XP', descRu: 'Набери 1000 XP', emoji: '📈', condition: s => s.totalXP >= 1000 },
  { id: 'xp_5000', name: 'Veteran', nameRu: 'Ветеран', desc: 'Earn 5,000 XP', descRu: 'Набери 5000 XP', emoji: '🎖️', condition: s => s.totalXP >= 5000 },
  { id: 'halfway', name: 'Halfway There', nameRu: 'Полпути', desc: 'Complete 50% of the course', descRu: 'Пройди 50% курса', emoji: '🛣️', condition: s => s.totalLessons >= 18 },
  { id: 'communicator', name: 'Radio Pro', nameRu: 'Радио-профи', desc: 'Complete both Communication chapters', descRu: 'Пройди обе главы по коммуникации', emoji: '📻', condition: s => s.chaptersCompleted.includes(6) && s.chaptersCompleted.includes(7) },
];

/* ── Career milestones for progress map ────────────────── */
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

/* ── State ──────────────────────────────────────────────── */
export interface GamificationState {
  totalXP: number;
  totalLessons: number;
  streak: number;
  lastActiveDate: string | null;
  chaptersCompleted: number[];
  unlockedAchievements: string[];
  speedLessons: number;
  perfectQuizzes: number;
  nightLessons: number;
  earlyLessons: number;
  lessonStartTime: number | null;
  pendingToast: { emoji: string; title: string; subtitle: string } | null;

  startLesson: () => void;
  completeLesson: (type: string, chapterOrder?: number) => number;
  completePerfectQuiz: () => void;
  dismissToast: () => void;
  getLevel: () => typeof LEVELS[number];
  getLevelProgress: () => number;
  getNewAchievements: () => Achievement[];
}

const STORAGE_KEY = 'lms_gamification';

function loadState(): Partial<GamificationState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(s: GamificationState) {
  if (typeof window === 'undefined') return;
  const { pendingToast, lessonStartTime, ...persist } = s;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(state: GamificationState): number {
  const today = todayStr();
  if (state.lastActiveDate === today) return state.streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  if (state.lastActiveDate === yStr) return state.streak + 1;
  return 1; // streak reset
}

export const useGamification = create<GamificationState>((set, get) => {
  const saved = loadState();
  return {
    totalXP: saved.totalXP ?? 0,
    totalLessons: saved.totalLessons ?? 0,
    streak: saved.streak ?? 0,
    lastActiveDate: saved.lastActiveDate ?? null,
    chaptersCompleted: saved.chaptersCompleted ?? [],
    unlockedAchievements: saved.unlockedAchievements ?? [],
    speedLessons: saved.speedLessons ?? 0,
    perfectQuizzes: saved.perfectQuizzes ?? 0,
    nightLessons: saved.nightLessons ?? 0,
    earlyLessons: saved.earlyLessons ?? 0,
    lessonStartTime: null,
    pendingToast: null,

    startLesson: () => set({ lessonStartTime: Date.now() }),

    completeLesson: (type, chapterOrder) => {
      const s = get();
      let xp = XP_PER_LESSON[type] ?? 50;
      const newStreak = updateStreak(s);
      const streakMultiplier = 1 + Math.min(newStreak, 5) * STREAK_BONUS_MULTIPLIER;
      xp = Math.round(xp * streakMultiplier);

      // Speed bonus
      let newSpeed = s.speedLessons;
      if (s.lessonStartTime && (Date.now() - s.lessonStartTime) < 5 * 60 * 1000) {
        xp += SPEED_BONUS;
        newSpeed++;
      }

      // Time of day
      const hour = new Date().getHours();
      let newNight = s.nightLessons;
      let newEarly = s.earlyLessons;
      if (hour >= 22 || hour < 4) newNight++;
      if (hour >= 4 && hour < 7) newEarly++;

      // Chapter completion
      const newChapters = [...s.chaptersCompleted];
      if (chapterOrder && !newChapters.includes(chapterOrder)) {
        newChapters.push(chapterOrder);
      }

      const newState: Partial<GamificationState> = {
        totalXP: s.totalXP + xp,
        totalLessons: s.totalLessons + 1,
        streak: newStreak,
        lastActiveDate: todayStr(),
        chaptersCompleted: newChapters,
        speedLessons: newSpeed,
        nightLessons: newNight,
        earlyLessons: newEarly,
        lessonStartTime: null,
      };

      // Check new achievements
      const tempState = { ...s, ...newState } as GamificationState;
      const newAchievements = ACHIEVEMENTS.filter(
        a => !s.unlockedAchievements.includes(a.id) && a.condition(tempState)
      );
      if (newAchievements.length > 0) {
        newState.unlockedAchievements = [
          ...s.unlockedAchievements,
          ...newAchievements.map(a => a.id),
        ];
        // Show first new achievement as toast
        const first = newAchievements[0];
        newState.pendingToast = {
          emoji: first.emoji,
          title: first.name,
          subtitle: `+${xp} XP`,
        };
      } else {
        newState.pendingToast = { emoji: '✅', title: `+${xp} XP`, subtitle: type };
      }

      set(newState);
      saveState({ ...s, ...newState } as GamificationState);
      return xp;
    },

    completePerfectQuiz: () => {
      const s = get();
      set({ perfectQuizzes: s.perfectQuizzes + 1 });
      saveState({ ...s, perfectQuizzes: s.perfectQuizzes + 1 } as GamificationState);
    },

    dismissToast: () => set({ pendingToast: null }),

    getLevel: () => {
      const xp = get().totalXP;
      let level = LEVELS[0];
      for (const l of LEVELS) {
        if (xp >= l.minXP) level = l;
      }
      return level;
    },

    getLevelProgress: () => {
      const xp = get().totalXP;
      const level = get().getLevel();
      const idx = LEVELS.indexOf(level);
      if (idx >= LEVELS.length - 1) return 100;
      const next = LEVELS[idx + 1];
      return Math.round(((xp - level.minXP) / (next.minXP - level.minXP)) * 100);
    },

    getNewAchievements: () => {
      const s = get();
      return ACHIEVEMENTS.filter(
        a => !s.unlockedAchievements.includes(a.id) && a.condition(s)
      );
    },
  };
});

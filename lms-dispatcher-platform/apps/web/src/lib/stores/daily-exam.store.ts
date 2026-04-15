import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyExamResult {
  score: number;
  passed: boolean;
  completedAt: string;
}

interface DailyExamStore {
  // userId -> day -> result
  resultsByUser: Record<string, Record<number, DailyExamResult>>;
  // Old un-namespaced results kept for one-time migration
  _legacyResults: Record<number, DailyExamResult>;

  setResult: (userId: string, day: number, score: number, passed: boolean) => void;
  getResult: (userId: string, day: number) => DailyExamResult | undefined;
  getUserResults: (userId: string) => Record<number, DailyExamResult>;
}

export const useDailyExamStore = create<DailyExamStore>()(
  persist(
    (set, get) => ({
      resultsByUser: {},
      _legacyResults: {},

      setResult: (userId, day, score, passed) =>
        set((s) => {
          const userResults = { ...(s.resultsByUser[userId] ?? {}) };
          userResults[day] = { score, passed, completedAt: new Date().toISOString() };
          return { resultsByUser: { ...s.resultsByUser, [userId]: userResults } };
        }),

      getResult: (userId, day) => get().resultsByUser[userId]?.[day],

      getUserResults: (userId) => {
        const s = get();
        // Auto-migrate legacy un-namespaced results into this user
        if (Object.keys(s._legacyResults).length > 0) {
          const migrated = { ...s._legacyResults };
          set((st) => ({
            _legacyResults: {},
            resultsByUser: {
              ...st.resultsByUser,
              [userId]: { ...migrated, ...(st.resultsByUser[userId] ?? {}) },
            },
          }));
          return { ...migrated, ...(s.resultsByUser[userId] ?? {}) };
        }
        return s.resultsByUser[userId] ?? {};
      },
    }),
    {
      name: 'daily-exam-results',
      version: 2,
      migrate: (persisted: any, version: number) => {
        if (version < 2) {
          return {
            resultsByUser: {},
            _legacyResults: persisted?.results ?? {},
          };
        }
        return persisted;
      },
    },
  ),
);

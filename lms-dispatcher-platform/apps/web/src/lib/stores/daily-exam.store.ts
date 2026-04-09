import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyExamResult {
  score: number;
  passed: boolean;
  completedAt: string;
}

interface DailyExamStore {
  results: Record<number, DailyExamResult>;
  setResult: (day: number, score: number, passed: boolean) => void;
  getResult: (day: number) => DailyExamResult | undefined;
}

export const useDailyExamStore = create<DailyExamStore>()(
  persist(
    (set, get) => ({
      results: {},
      setResult: (day, score, passed) =>
        set(s => ({
          results: {
            ...s.results,
            [day]: { score, passed, completedAt: new Date().toISOString() },
          },
        })),
      getResult: day => get().results[day],
    }),
    { name: 'daily-exam-results' },
  ),
);

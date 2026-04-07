import { apiFetch } from './client';

export interface DailyExamItem {
  id: string;
  examNumber: number;
  score: number;
  passed: boolean;
  completedAt: string | null;
  unlockedAt: string;
}

export interface DailyExamsResponse {
  unlocked: boolean;
  completedChapters?: number;
  total?: number;
  available?: number;
  completed?: number;
  passed?: number;
  exams: DailyExamItem[];
}

export interface ExamQuestion {
  id: string;
  text: string;
  isMultiple: boolean;
  options: { id: string; text: string }[];
}

export const dailyExamsApi = {
  getExams: () => apiFetch<DailyExamsResponse>('/daily-exams'),
  getQuestions: (num: number) => apiFetch<ExamQuestion[]>(`/daily-exams/${num}/questions`),
  submit: (num: number, answers: { questionId: string; selectedOptionIds: string[] }[]) =>
    apiFetch<{ score: number; passed: boolean; threshold: number; results: any[] }>(
      `/daily-exams/${num}/submit`,
      { method: 'POST', body: JSON.stringify({ answers }) },
    ),
  getStats: () => apiFetch<any[]>('/daily-exams/stats'),
};

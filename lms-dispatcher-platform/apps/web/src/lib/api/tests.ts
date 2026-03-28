import { apiFetch } from './client';
import type { TestQuestion, TestResult } from '@/types';

export const testsApi = {
  getQuestions: (chapterId: string) =>
    apiFetch<TestQuestion[]>(`/tests/chapters/${chapterId}/questions`),

  submit: (chapterId: string, answers: { questionId: string; selectedOptionIds: string[] }[]) =>
    apiFetch<TestResult>(`/tests/chapters/${chapterId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getAttempts: (chapterId: string) =>
    apiFetch<{ id: string; score: number; passed: boolean; completedAt: string }[]>(
      `/tests/chapters/${chapterId}/attempts`,
    ),
};

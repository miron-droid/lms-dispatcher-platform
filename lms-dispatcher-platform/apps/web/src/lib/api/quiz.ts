import { apiFetch } from './client';

export interface QuizAttemptInput {
  lessonId: string;
  answers: number[];
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

export interface QuizAttemptResult {
  xpEarned: number;
  totalXP: number;
  level: number;
  newAchievements: string[];
  streak: number;
}

export interface QuizAttemptRecord {
  id: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  createdAt: string;
}

export const quizApi = {
  submit: (input: QuizAttemptInput) =>
    apiFetch<QuizAttemptResult>('/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  myAttempts: () => apiFetch<QuizAttemptRecord[]>('/quiz-attempts/my'),
};

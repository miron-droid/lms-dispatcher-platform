import { apiFetch } from './client';

export interface QuizAnswerEntry {
  questionId: string;
  selectedIndex: number;
}

export interface QuizAttemptInput {
  lessonId: string;
  // Rich per-question answers. Legacy number[] is still accepted by the
  // backend for backward compatibility, but new clients should always
  // send { questionId, selectedIndex }[] so the server can grade each
  // question and populate analytics.
  answers: QuizAnswerEntry[] | number[];
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
  // Server-authoritative grading echoed back so the UI can show the
  // real score instead of its (untrusted) local count.
  passed?: boolean;
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
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

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

// One graded answer as returned by the backend after a quiz submission.
// correctIndex is ONLY present here (it is stripped from GET /lessons/:id
// for security) so the review screen uses this to show the right answer.
export interface GradedAnswer {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation?: string;
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
  // Per-question graded review. Lets the client show a truthful
  // "which ones did I get wrong and what was the correct answer?"
  // breakdown after the quiz is submitted.
  gradedAnswers?: GradedAnswer[];
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

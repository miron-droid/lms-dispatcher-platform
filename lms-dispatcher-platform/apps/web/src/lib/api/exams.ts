import { apiFetch } from './client';
import type { ExamRequest } from '@/types';
import type { ExamDecision } from '@/types';

export const examsApi = {
  request: (chapterId: string, preferredAt?: string) =>
    apiFetch<ExamRequest>('/exams/request', {
      method: 'POST',
      body: JSON.stringify({ chapterId, preferredAt }),
    }),

  myExams: () => apiFetch<ExamRequest[]>('/exams/my'),

  pending: () => apiFetch<ExamRequest[]>('/exams/pending'),

  review: (examId: string, decision: ExamDecision, comment: string) =>
    apiFetch<ExamRequest>(`/exams/${examId}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, comment }),
    }),
};

import { apiFetch } from './client';
import type { Chapter, Lesson, ChapterProgressItem, CourseProgress } from '@/types';

export const coursesApi = {
  getAll: () =>
    apiFetch<{ id: string; title: string; chapters: Chapter[] }[]>('/courses'),

  getProgress: (courseId: string) =>
    apiFetch<CourseProgress>(`/progress/courses/${courseId}`),

  initializeCourse: (courseId: string) =>
    apiFetch<void>(`/progress/courses/${courseId}/initialize`, { method: 'POST' }),

  getChapter: (chapterId: string) =>
    apiFetch<{ chapter: { id: string; title: string; lessons: Lesson[] }; progress: any }>(
      `/chapters/${chapterId}`,
    ),

  getLesson: (lessonId: string) =>
    apiFetch<{
      lesson: Lesson;
      progress: any;
      hasQuiz?: boolean;
      quizPassed?: boolean;
      bestQuizScore?: number | null;
    }>(`/lessons/${lessonId}`),

  completeLesson: (lessonId: string) =>
    apiFetch<{ completed: boolean; nextLessonId: string | null }>(
      `/lessons/${lessonId}/complete`,
      { method: 'POST' },
    ),
};

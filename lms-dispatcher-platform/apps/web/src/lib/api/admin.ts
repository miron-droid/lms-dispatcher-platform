import { apiFetch } from './client';

export interface DashboardStats {
  activeStudents: number;
  avgTestScore: number;
  pendingExams: number;
  passedExams: number;
}

export interface StudentAnalytics {
  id: string;
  name: string;
  chaptersCompleted: number;
  avgTestScore: number | null;
  lastExamDecision: string | null;
  lastActiveAt: string | null;
}

export interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  managerId: string | null;
  lastActiveAt: string | null;
  isActive: boolean;
  manager?: { firstName: string; lastName: string };
}

export interface DetailedStudent {
  id: string;
  name: string;
  lastActiveAt: string | null;
  completedChapters: number;
  totalLessons: number;
  avgScore: number | null;
  testAttemptsCount: number;
  testsPassedCount: number;
  quizAttemptsCount: number;
  totalXP: number;
  streak: number;
  chapters: {
    chapter: number;
    status: string;
    testPassed: boolean;
    examPassed: boolean;
    testScore: number | null;
    lessons: { id: string; status: string }[];
  }[];
}

export interface StudentLessonQuizAttempts {
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  attempts: number;
  bestScore: number;
  lastScore: number;
  lastAttemptAt: string;
}

export interface StudentDetail {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastActiveAt: string | null;
  };
  summary: {
    totalChapters: number;
    chaptersCompleted: number;
    totalLessons: number;
    lessonsCompleted: number;
    testAttempts: number;
    testsPassed: number;
    averageScore: number;
  };
  chapters: Array<{
    id?: string;
    order: number;
    title: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
    lessonsCompleted: number;
    totalLessons: number;
    testPassed: boolean;
    examPassed: boolean;
    completedAt: string | null;
    testAttempts: Array<{
      score: number;
      passed: boolean;
      completedAt: string;
      totalQuestions: number;
      correctAnswers: number;
    }>;
    quizAttempts?: StudentLessonQuizAttempts[];
  }>;
}

// ── Analytics types ──
export interface ActivityDay {
  date: string;             // ISO date (YYYY-MM-DD)
  lessonsCompleted: number;
  quizAttempts: number;
  activeUsers: number;
}

export interface HeatmapCell {
  dayOfWeek: number;        // 0 (Sun) – 6 (Sat)
  hour: number;             // 0 – 23
  count: number;
}

export interface FunnelStage {
  key: string;              // 'registered' | 'started' | 'chapter1' | 'chapters3plus' | 'chapters9'
  label: string;
  count: number;
  percent: number;          // % of previous stage (0–100)
}

export interface ChapterDifficulty {
  chapter: number;          // 1 – 9
  title: string;
  avgScore: number;         // 0 – 100
  passRate: number;         // 0 – 100
  attempts: number;
}

export interface QuestionStat {
  id: string;
  chapter: number;
  chapterTitle: string;
  text: string;
  attempts: number;
  correctRate: number;      // 0 – 100
}

export const adminApi = {
  dashboard: () => apiFetch<DashboardStats>('/admin/dashboard'),
  students: () => apiFetch<StudentAnalytics[]>('/admin/analytics/students'),
  detailed: () => apiFetch<DetailedStudent[]>('/admin/analytics/detailed'),
  getStudentDetails: (userId: string) => apiFetch<StudentDetail>(`/admin/students/${userId}/details`),

  // Analytics
  getActivity: (days = 30) =>
    apiFetch<{ days: ActivityDay[] }>(`/admin/analytics/activity?days=${days}`),
  getHeatmap: () =>
    apiFetch<{ heatmap: HeatmapCell[]; max: number }>(`/admin/analytics/heatmap`),
  getFunnel: () =>
    apiFetch<{ stages: FunnelStage[] }>(`/admin/analytics/funnel`),
  getChapterDifficulty: () =>
    apiFetch<{ chapters: ChapterDifficulty[] }>(`/admin/analytics/chapter-difficulty`),
  getQuestionStats: () =>
    apiFetch<{ questions: QuestionStat[] }>(`/admin/analytics/question-stats`),

  // Manager actions on student progress
  unlockChapter: (userId: string, chapterId: string) =>
    apiFetch<{ unlocked: boolean }>(`/admin/students/${userId}/chapters/${chapterId}/unlock`, { method: 'POST' }),
  completeChapter: (userId: string, chapterId: string) =>
    apiFetch<{ completed: boolean }>(`/admin/students/${userId}/chapters/${chapterId}/complete`, { method: 'POST' }),

  // Users
  listUsers: (role?: string) => apiFetch<UserItem[]>(`/users${role ? `?role=${role}` : ''}`),
  getUser: (id: string) => apiFetch<UserItem>(`/users/${id}`),
  createUser: (data: { email: string; password: string; firstName: string; lastName: string; role: string; managerId?: string }) =>
    apiFetch<UserItem>('/users', { method: 'POST', body: JSON.stringify(data) }),
  deactivateUser: (id: string) => apiFetch<void>(`/users/${id}`, { method: 'DELETE' }),
  resetPassword: (id: string, password: string) => apiFetch<void>(`/users/${id}/password`, { method: 'PATCH', body: JSON.stringify({ password }) }),
  resetProgress: (id: string) => apiFetch<{ reset: boolean }>(`/users/${id}/reset-progress`, { method: 'POST' }),
  myStudents: () => apiFetch<UserItem[]>('/users/my-students'),
};

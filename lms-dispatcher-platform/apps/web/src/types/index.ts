export type UserRole = 'STUDENT' | 'MANAGER' | 'ADMIN';
export type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
export type ExamDecision = 'PASS' | 'RETRY' | 'DISBAND';
export type ExamStatus = 'REQUESTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type LessonType = 'INTRO' | 'THEORY' | 'DEMO' | 'PRACTICE' | 'TEST' | 'EXAM';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  managerId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  passThreshold: number;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  order: number;
  content?: TextContent | VideoContent | DialogueContent | CaseContent;
  lessonProgress?: { status: ProgressStatus }[];
}

export interface TextContent    { type: 'text'; body: string }
export interface VideoContent   { type: 'video'; hlsUrl: string; posterUrl?: string }
export interface DialogueContent { type: 'dialogue'; messages: { role: 'broker' | 'dispatcher' | 'driver'; text: string }[] }
export interface CaseContent    { type: 'case'; scenario: string; options: { label: string; explanation: string }[]; correctIndex: number }

export interface ChapterProgressItem {
  id: string;
  title: string;
  order: number;
  status: ProgressStatus;
  testPassed: boolean;
  examPassed: boolean;
  lessonsTotal: number;
  lessonsCompleted: number;
}

export interface CourseProgress {
  courseId: string;
  overallPercent: number;
  chapters: ChapterProgressItem[];
}

export interface ExamRequest {
  id: string;
  chapterId: string;
  status: ExamStatus;
  decision?: ExamDecision;
  comment?: string;
  scheduledAt?: string;
  createdAt: string;
  chapter: { id: string; title: string };
  student?: { id: string; firstName: string; lastName: string; email: string };
}

export interface TestQuestion {
  id: string;
  text: string;
  isMultiple: boolean;
  options: { id: string; text: string }[];
}

export interface TestResult {
  score: number;
  passed: boolean;
  threshold: number;
  results: { questionId: string; isCorrect: boolean; explanation?: string; correctOptionIds: string[] }[];
}

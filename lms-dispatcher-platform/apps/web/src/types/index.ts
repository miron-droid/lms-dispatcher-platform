export type UserRole = 'STUDENT' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';
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
  companyId?: string;
  companySlug?: string;
  companyName?: string;
  totalXP?: number;
  streak?: number;
  level?: number;
  achievements?: string[];
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

export interface QuizQuestion   { id: string; text: string; options: string[]; correctIndex: number; explanation?: string }
export interface TextContent    { type: 'text'; body: string; bodyRu?: string; quiz?: { questions: QuizQuestion[] }; quizRu?: { questions: QuizQuestion[] }; simulation?: boolean; freightMap?: boolean; equipmentMatcher?: boolean; phoneCall?: boolean; driverChat?: boolean; loadBoard?: boolean; negotiationGame?: boolean; crisisDashboard?: boolean; brokerCall?: boolean; dispatcherDay?: boolean }
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
  quizzesTotal?: number;
  quizzesPassed?: number;
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

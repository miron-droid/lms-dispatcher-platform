export enum UserRole {
  STUDENT = 'STUDENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum LessonType {
  INTRO = 'INTRO',
  THEORY = 'THEORY',
  DEMO = 'DEMO',
  PRACTICE = 'PRACTICE',
  TEST = 'TEST',
  EXAM = 'EXAM',
}

export enum ProgressStatus {
  LOCKED = 'LOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum ExamDecision {
  PASS = 'PASS',
  RETRY = 'RETRY',
  DISBAND = 'DISBAND',
}

export enum ExamStatus {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

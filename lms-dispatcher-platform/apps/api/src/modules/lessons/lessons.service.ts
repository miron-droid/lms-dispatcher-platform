import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressStatus, ContentStatus } from '@prisma/client';
import { awardXPAndUpdateStreak, xpForLessonType } from '../quiz-attempts/gamification';

// Quiz-pass threshold (percent). Also used in frontend gating logic.
const QUIZ_PASS_THRESHOLD = 80;

// A lesson "has a quiz" when its JSON content is text + has questions in
// either quiz or quizRu. This keeps parity with progress.service.ts.
function lessonHasQuiz(content: unknown): boolean {
  const c = content as
    | { type?: string; quiz?: { questions?: unknown[] }; quizRu?: { questions?: unknown[] } }
    | null
    | undefined;
  if (!c || c.type !== 'text') return false;
  const qs = c.quiz?.questions ?? c.quizRu?.questions;
  return Array.isArray(qs) && qs.length > 0;
}

/**
 * Strip correctIndex from quiz questions in lesson content so students
 * cannot cheat by reading the answers from the API response.
 */
function stripQuizAnswers<T extends { content: unknown }>(lesson: T): T {
  const content = lesson.content as any;
  if (!content || typeof content !== 'object') return lesson;

  const clean = JSON.parse(JSON.stringify(content));

  function sanitizeQuiz(quiz: any) {
    if (!quiz || !Array.isArray(quiz.questions)) return;
    quiz.questions = quiz.questions.map((q: any) => {
      const { correctIndex, correct, isCorrect, ...rest } = q || {};
      // Also strip any per-option correct flags
      if (Array.isArray(rest.options)) {
        rest.options = rest.options.map((opt: any) => {
          if (typeof opt === 'string') return opt;
          const { isCorrect, correct, ...optRest } = opt || {};
          return optRest;
        });
      }
      return rest;
    });
  }

  if (clean.quiz) sanitizeQuiz(clean.quiz);
  if (clean.quizRu) sanitizeQuiz(clean.quizRu);

  return { ...lesson, content: clean } as T;
}

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId, status: ContentStatus.PUBLISHED },
      include: { chapter: { select: { id: true, title: true } } },
    });

    const progress = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    // Compute quiz state for this lesson so the UI can gate "Mark complete".
    const hasQuiz = lessonHasQuiz(lesson.content);
    let quizPassed = false;
    let bestQuizScore: number | null = null;
    if (hasQuiz) {
      const best = await this.prisma.quizAttempt.findFirst({
        where: { userId, lessonId },
        orderBy: { score: 'desc' },
        select: { score: true },
      });
      bestQuizScore = best?.score ?? null;
      quizPassed = (best?.score ?? 0) >= QUIZ_PASS_THRESHOLD;
    }

    // Strip correctIndex from quiz questions so students cannot cheat
    const sanitizedLesson = stripQuizAnswers(lesson);
    return { lesson: sanitizedLesson, progress, hasQuiz, quizPassed, bestQuizScore };
  }

  async quizStatus(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId, status: ContentStatus.PUBLISHED },
      select: { id: true, content: true },
    });
    const hasQuiz = lessonHasQuiz(lesson.content);
    if (!hasQuiz) {
      return {
        hasQuiz: false,
        totalQuestions: 0,
        attempted: false,
        bestScore: null,
        passed: true,
        attemptCount: 0,
      };
    }
    const content = lesson.content as any;
    const totalQuestions =
      content?.quiz?.questions?.length ?? content?.quizRu?.questions?.length ?? 0;
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, lessonId },
      select: { score: true },
      orderBy: { score: 'desc' },
    });
    const bestScore = attempts[0]?.score ?? null;
    return {
      hasQuiz: true,
      totalQuestions,
      attempted: attempts.length > 0,
      bestScore,
      passed: (bestScore ?? 0) >= QUIZ_PASS_THRESHOLD,
      attemptCount: attempts.length,
    };
  }

  async complete(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            lessons: { where: { status: ContentStatus.PUBLISHED }, orderBy: { order: 'asc' } },
          },
        },
      },
    });

    // Enforce: a lesson that carries a quiz can only be marked complete
    // after the student has a passing attempt (>=80%). Defence-in-depth —
    // the frontend also gates the button.
    if (lessonHasQuiz(lesson.content)) {
      const best = await this.prisma.quizAttempt.findFirst({
        where: { userId, lessonId },
        orderBy: { score: 'desc' },
        select: { score: true },
      });
      if ((best?.score ?? 0) < QUIZ_PASS_THRESHOLD) {
        throw new BadRequestException('QUIZ_NOT_PASSED');
      }
    }

    // Mark current lesson complete
    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { status: ProgressStatus.COMPLETED, completedAt: new Date() },
      create: {
        userId, lessonId,
        status: ProgressStatus.COMPLETED, completedAt: new Date(),
      },
    });

    // Unlock next lesson in same chapter
    const lessons = lesson.chapter.lessons;
    const currentIdx = lessons.findIndex((l) => l.id === lessonId);
    const next = lessons[currentIdx + 1];

    if (next) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: next.id } },
        update: {},
        create: { userId, lessonId: next.id, status: ProgressStatus.IN_PROGRESS },
      });
    }

    // Check if all lessons in chapter are done — update chapter progress
    const allProgress = await this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    });
    const allDone = lessons.every((l) =>
      allProgress.find((p) => p.lessonId === l.id)?.status === ProgressStatus.COMPLETED,
    );

    if (allDone) {
      // All 4 lessons finished (with quizzes passed) = chapter complete.
      // Unlock the next chapter so the student can proceed.
      await this.prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId: lesson.chapterId } },
        update: {
          status: ProgressStatus.COMPLETED,
          testPassed: true,
          completedAt: new Date(),
        },
        create: {
          userId,
          chapterId: lesson.chapterId,
          status: ProgressStatus.COMPLETED,
          testPassed: true,
          completedAt: new Date(),
        },
      });

      // Find next chapter by order and unlock its first lesson
      const currentChapter = await this.prisma.chapter.findUnique({
        where: { id: lesson.chapterId },
        select: { order: true, courseId: true },
      });
      if (currentChapter) {
        const nextChapter = await this.prisma.chapter.findFirst({
          where: {
            courseId: currentChapter.courseId,
            order: currentChapter.order + 1,
            status: ContentStatus.PUBLISHED,
          },
          include: {
            lessons: {
              where: { status: ContentStatus.PUBLISHED },
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        });
        if (nextChapter) {
          // Upsert ChapterProgress to IN_PROGRESS (unless already COMPLETED)
          const existingNextCp = await this.prisma.chapterProgress.findUnique({
            where: { userId_chapterId: { userId, chapterId: nextChapter.id } },
          });
          if (!existingNextCp || existingNextCp.status !== ProgressStatus.COMPLETED) {
            await this.prisma.chapterProgress.upsert({
              where: { userId_chapterId: { userId, chapterId: nextChapter.id } },
              update: { status: ProgressStatus.IN_PROGRESS },
              create: {
                userId,
                chapterId: nextChapter.id,
                status: ProgressStatus.IN_PROGRESS,
              },
            });
          }
          // Unlock first lesson of next chapter
          const firstLesson = nextChapter.lessons[0];
          if (firstLesson) {
            await this.prisma.lessonProgress.upsert({
              where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
              update: {},
              create: {
                userId,
                lessonId: firstLesson.id,
                status: ProgressStatus.IN_PROGRESS,
              },
            });
          }
        }
      }
    }

    // Award XP + streak + achievements
    const xpEarned = xpForLessonType(lesson.type);
    const gam = await awardXPAndUpdateStreak(this.prisma, userId, xpEarned);

    // Cross-chapter navigation: if no next lesson in current chapter,
    // point to the first unlocked lesson in the next chapter (if any)
    let nextLessonId: string | null = next?.id ?? null;
    if (!nextLessonId && allDone) {
      const currentChapter = await this.prisma.chapter.findUnique({
        where: { id: lesson.chapterId },
        select: { order: true, courseId: true },
      });
      if (currentChapter) {
        const nextChapter = await this.prisma.chapter.findFirst({
          where: {
            courseId: currentChapter.courseId,
            order: currentChapter.order + 1,
            status: ContentStatus.PUBLISHED,
          },
          include: {
            lessons: {
              where: { status: ContentStatus.PUBLISHED },
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
        });
        nextLessonId = nextChapter?.lessons[0]?.id ?? null;
      }
    }

    return { completed: true, nextLessonId, gamification: gam };
  }
}

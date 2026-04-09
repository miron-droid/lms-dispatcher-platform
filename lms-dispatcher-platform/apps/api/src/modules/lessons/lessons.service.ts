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

    return { lesson, progress, hasQuiz, quizPassed, bestQuizScore };
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

    return { completed: true, nextLessonId: next?.id ?? null, gamification: gam };
  }
}

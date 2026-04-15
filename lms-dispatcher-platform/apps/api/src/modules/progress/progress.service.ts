import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        chapters: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          include: {
            chapterProgress: { where: { userId } },
            lessons: {
              where: { status: ContentStatus.PUBLISHED },
              include: { lessonProgress: { where: { userId } } },
            },
          },
        },
      },
    });

    // Pull the user's passing quiz attempts (score >= 80) once — used for
    // "quizzes passed" counters in the chapter cards.
    const passingAttempts = await this.prisma.quizAttempt.findMany({
      where: { userId, score: { gte: 80 } },
      select: { lessonId: true },
    });
    const passedLessonIds = new Set(passingAttempts.map((a) => a.lessonId));

    const lessonHasQuiz = (lesson: { content: unknown }) => {
      const c = lesson.content as
        | { type?: string; quiz?: { questions?: unknown[] }; quizRu?: { questions?: unknown[] } }
        | null
        | undefined;
      if (!c || c.type !== 'text') return false;
      const qs = c.quiz?.questions ?? c.quizRu?.questions;
      return Array.isArray(qs) && qs.length > 0;
    };

    const chapters = course.chapters.map((ch) => {
      const cp = ch.chapterProgress[0];
      const totalLessons = ch.lessons.length;
      const completedLessons = ch.lessons.filter(
        (l) => l.lessonProgress[0]?.status === ProgressStatus.COMPLETED,
      ).length;

      const quizLessons = ch.lessons.filter((l) => lessonHasQuiz(l));
      const quizzesTotal = quizLessons.length;
      const quizzesPassed = quizLessons.filter((l) => passedLessonIds.has(l.id)).length;

      return {
        id: ch.id,
        title: ch.title,
        order: ch.order,
        status: cp?.status ?? ProgressStatus.LOCKED,
        testPassed: cp?.testPassed ?? false,
        examPassed: cp?.examPassed ?? false,
        lessonsTotal: totalLessons,
        lessonsCompleted: completedLessons,
        quizzesTotal,
        quizzesPassed,
      };
    });

    const totalChapters = chapters.length;
    const passedChapters = chapters.filter((c: any) => c.status === "COMPLETED" || c.testPassed || c.examPassed).length;

    return {
      courseId,
      overallPercent: totalChapters > 0 ? Math.round((passedChapters / totalChapters) * 100) : 0,
      chapters,
    };
  }

  async initializeCourse(userId: string, courseId: string) {
    const firstChapter = await this.prisma.chapter.findFirst({
      where: { courseId, status: ContentStatus.PUBLISHED },
      orderBy: { order: 'asc' },
      include: {
        lessons: { where: { status: ContentStatus.PUBLISHED }, orderBy: { order: 'asc' } },
      },
    });
    if (!firstChapter) return;

    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: firstChapter.id } },
      update: {},
      create: { userId, chapterId: firstChapter.id, status: ProgressStatus.IN_PROGRESS },
    });

    const firstLesson = firstChapter.lessons[0];
    if (firstLesson) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
        update: {},
        create: { userId, lessonId: firstLesson.id, status: ProgressStatus.IN_PROGRESS },
      });
    }
  }
}

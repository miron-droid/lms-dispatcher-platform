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

    const chapters = course.chapters.map((ch) => {
      const cp = ch.chapterProgress[0];
      const totalLessons = ch.lessons.length;
      const completedLessons = ch.lessons.filter(
        (l) => l.lessonProgress[0]?.status === ProgressStatus.COMPLETED,
      ).length;
      return {
        id: ch.id,
        title: ch.title,
        order: ch.order,
        status: cp?.status ?? ProgressStatus.LOCKED,
        testPassed: cp?.testPassed ?? false,
        examPassed: cp?.examPassed ?? false,
        lessonsTotal: totalLessons,
        lessonsCompleted: completedLessons,
      };
    });

    const totalChapters = chapters.length;
    const completedChapters = chapters.filter((c) => c.status === ProgressStatus.COMPLETED).length;

    return {
      courseId,
      overallPercent: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
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

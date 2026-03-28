import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressStatus, ContentStatus } from '@prisma/client';

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

    return { lesson, progress };
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
      await this.prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId: lesson.chapterId } },
        update: { status: ProgressStatus.IN_PROGRESS },
        create: { userId, chapterId: lesson.chapterId, status: ProgressStatus.IN_PROGRESS },
      });
    }

    return { completed: true, nextLessonId: next?.id ?? null };
  }
}

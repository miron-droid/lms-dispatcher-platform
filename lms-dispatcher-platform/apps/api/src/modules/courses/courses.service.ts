import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, ProgressStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findPublished(userId?: string) {
    const courses = await this.prisma.course.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        chapters: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            passThreshold: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    if (!userId) {
      return courses.map((c) => ({
        ...c,
        chapters: c.chapters.map((ch, idx) => ({
          ...ch,
          isLocked: idx !== 0,
          status: idx === 0 ? ProgressStatus.IN_PROGRESS : ProgressStatus.LOCKED,
          testPassed: false,
          examPassed: false,
        })),
      }));
    }

    // Load user's chapter progress for all chapters in one go
    const chapterIds = courses.flatMap((c) => c.chapters.map((ch) => ch.id));
    const progress = await this.prisma.chapterProgress.findMany({
      where: { userId, chapterId: { in: chapterIds } },
    });
    const progressMap = new Map(progress.map((p) => [p.chapterId, p]));

    return courses.map((c) => {
      const decorated = c.chapters.map((ch, idx) => {
        const cp = progressMap.get(ch.id);
        const prevCh = idx > 0 ? c.chapters[idx - 1] : null;
        const prevCp = prevCh ? progressMap.get(prevCh.id) : null;

        // Chapter 1 always unlocked. Otherwise, unlocked iff previous chapter
        // is COMPLETED with testPassed = true.
        const isFirst = idx === 0;
        const prevCompleted =
          !!prevCp && prevCp.status === ProgressStatus.COMPLETED && prevCp.testPassed === true;
        const isLocked = !isFirst && !prevCompleted;

        // Effective status (don't expose stale LOCKED row if it should be unlocked)
        let status: ProgressStatus;
        if (cp?.status === ProgressStatus.COMPLETED) status = ProgressStatus.COMPLETED;
        else if (isLocked) status = ProgressStatus.LOCKED;
        else status = cp?.status ?? ProgressStatus.IN_PROGRESS;

        return {
          ...ch,
          isLocked,
          status,
          testPassed: cp?.testPassed ?? false,
          examPassed: cp?.examPassed ?? false,
          completedAt: cp?.completedAt ?? null,
        };
      });
      return { ...c, chapters: decorated };
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { chapters: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }
}

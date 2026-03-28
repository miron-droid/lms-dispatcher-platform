import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, ProgressStatus } from '@prisma/client';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  async findOne(chapterId: string, userId: string) {
    const progress = await this.prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    });

    if (progress?.status === ProgressStatus.LOCKED) {
      throw new ForbiddenException('Complete the previous chapter first');
    }

    const chapter = await this.prisma.chapter.findUniqueOrThrow({
      where: { id: chapterId, status: ContentStatus.PUBLISHED },
      include: {
        lessons: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          include: {
            lessonProgress: { where: { userId }, select: { status: true } },
          },
        },
        _count: { select: { questions: true } },
      },
    });

    return { chapter, progress };
  }
}

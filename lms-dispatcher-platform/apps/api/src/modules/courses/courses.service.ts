import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findPublished() {
    return this.prisma.course.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        chapters: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, order: true, passThreshold: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { chapters: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }
}

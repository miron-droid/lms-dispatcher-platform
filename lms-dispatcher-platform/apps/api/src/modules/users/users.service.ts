import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../../common/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { password: _, ...rest } = dto;

    return this.prisma.user.create({
      data: { ...rest, passwordHash },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, managerId: true },
    });
  }

  findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: { isActive: true, ...(role ? { role } : {}) },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, lastActiveAt: true,
        manager: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, isActive: true, lastActiveAt: true,
      },
    });
  }

  deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });
  }

  getStudentsForManager(managerId: string) {
    return this.prisma.user.findMany({
      where: { managerId, isActive: true, role: UserRole.STUDENT },
      select: {
        id: true, email: true, firstName: true, lastName: true, lastActiveAt: true,
        chapterProgress: {
          select: { chapterId: true, status: true, testPassed: true, examPassed: true },
        },
      },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true, email: true },
    });
  }

  async resetProgress(id: string) {
    await this.prisma.testAttempt.deleteMany({ where: { userId: id } });
    await this.prisma.lessonProgress.deleteMany({ where: { userId: id } });
    await this.prisma.chapterProgress.deleteMany({ where: { userId: id } });

    // Re-initialize: unlock first chapter + first lesson
    const firstChapter = await this.prisma.chapter.findFirst({
      where: { course: { status: 'PUBLISHED' }, status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
    if (firstChapter) {
      await this.prisma.chapterProgress.create({
        data: { userId: id, chapterId: firstChapter.id, status: 'IN_PROGRESS' },
      });
      const firstLesson = await this.prisma.lesson.findFirst({
        where: { chapterId: firstChapter.id, status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      });
      if (firstLesson) {
        await this.prisma.lessonProgress.create({
          data: { userId: id, lessonId: firstLesson.id, status: 'IN_PROGRESS' },
        });
      }
    }
    return { reset: true };
  }
}

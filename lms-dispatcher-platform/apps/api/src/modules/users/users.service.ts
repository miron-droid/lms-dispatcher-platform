import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../admin/audit.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../../common/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(dto: CreateUserDto, requesterRole: UserRole, requesterId: string, companyId?: string | null) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) throw new ConflictException('Email already in use');

    // MANAGER can only create STUDENTS and auto-assigns themselves as manager.
    // ADMIN can create any role within their company.
    // SUPER_ADMIN can create any role in any company.
    let role = dto.role;
    let managerId = dto.managerId;
    if (requesterRole !== UserRole.ADMIN && requesterRole !== UserRole.SUPER_ADMIN) {
      if (role && role !== UserRole.STUDENT) {
        throw new ForbiddenException('Only ADMIN can create non-student accounts');
      }
      role = UserRole.STUDENT;
      managerId = requesterId;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { password: _, ...rest } = dto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        email: dto.email.toLowerCase().trim(),
        role,
        managerId: managerId ?? null,
        passwordHash,
        companyId: companyId ?? null,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, managerId: true, companyId: true },
    });

    // Fetch actor email for audit
    const actor = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { email: true } });
    await this.audit.log({
      actorId: requesterId,
      actorEmail: actor?.email ?? 'unknown',
      actorRole: requesterRole,
      action: 'USER_CREATED',
      targetType: 'User',
      targetId: user.id,
      targetEmail: user.email,
      details: { role: user.role, managerId: user.managerId, companyId: user.companyId },
    });

    return user;
  }

  findAll(role?: UserRole, requesterRole?: UserRole, requesterId?: string, companyId?: string | null) {
    // MANAGER only sees their students; ADMIN sees their company; SUPER_ADMIN sees all
    const where: any = { isActive: true };
    if (role) where.role = role;

    // Tenant isolation: non-SUPER_ADMIN users only see their own company
    if (requesterRole !== UserRole.SUPER_ADMIN && companyId) {
      where.companyId = companyId;
    }

    if (requesterRole === UserRole.MANAGER) {
      where.managerId = requesterId;
      where.role = UserRole.STUDENT;
    }
    return this.prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, lastActiveAt: true, companyId: true,
        manager: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, requesterRole: UserRole, requesterId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, isActive: true, lastActiveAt: true,
        companyId: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    // MANAGER can only view own students
    if (requesterRole === UserRole.MANAGER && (user.role !== UserRole.STUDENT || user.managerId !== requesterId)) {
      throw new ForbiddenException('Not your student');
    }
    return user;
  }

  /**
   * Shared permission check — MANAGER can only mutate their own students.
   * ADMIN can do anything to anyone EXCEPT their own account (safety rail).
   * SUPER_ADMIN can mutate anyone.
   */
  private async assertCanMutate(targetId: string, requesterRole: UserRole, requesterId: string) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, role: true, managerId: true },
    });
    if (!target) throw new NotFoundException('User not found');

    if (requesterRole === UserRole.SUPER_ADMIN) {
      return target;
    }

    if (requesterRole === UserRole.ADMIN) {
      if (target.id === requesterId) {
        throw new ForbiddenException('Cannot mutate your own account via users endpoint');
      }
      return target;
    }

    if (requesterRole === UserRole.MANAGER) {
      if (target.role !== UserRole.STUDENT || target.managerId !== requesterId) {
        throw new ForbiddenException('Not your student');
      }
      return target;
    }

    throw new ForbiddenException('Insufficient permissions');
  }

  async deactivate(id: string, requesterRole: UserRole, requesterId: string) {
    await this.assertCanMutate(id, requesterRole, requesterId);
    const result = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, email: true, isActive: true },
    });

    const actor = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { email: true } });
    await this.audit.log({
      actorId: requesterId,
      actorEmail: actor?.email ?? 'unknown',
      actorRole: requesterRole,
      action: 'USER_DEACTIVATED',
      targetType: 'User',
      targetId: id,
      targetEmail: result.email,
    });

    return { id: result.id, isActive: result.isActive };
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

  async resetPassword(id: string, newPassword: string, requesterRole: UserRole, requesterId: string) {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    await this.assertCanMutate(id, requesterRole, requesterId);
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true, email: true },
    });

    const actor = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { email: true } });
    await this.audit.log({
      actorId: requesterId,
      actorEmail: actor?.email ?? 'unknown',
      actorRole: requesterRole,
      action: 'PASSWORD_RESET',
      targetType: 'User',
      targetId: id,
      targetEmail: result.email,
    });

    return result;
  }

  async resetProgress(id: string, requesterRole: UserRole, requesterId: string) {
    await this.assertCanMutate(id, requesterRole, requesterId);

    // Fetch target email before reset
    const target = await this.prisma.user.findUnique({ where: { id }, select: { email: true } });

    await this.prisma.$transaction([
      this.prisma.quizAttempt.deleteMany({ where: { userId: id } }),
      this.prisma.testAttempt.deleteMany({ where: { userId: id } }),
      this.prisma.lessonProgress.deleteMany({ where: { userId: id } }),
      this.prisma.chapterProgress.deleteMany({ where: { userId: id } }),
      this.prisma.user.update({
        where: { id },
        data: {
          totalXP: 0,
          streak: 0,
          lastStudyDate: null,
          achievements: [],
        },
      }),
    ]);

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

    const actor = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { email: true } });
    await this.audit.log({
      actorId: requesterId,
      actorEmail: actor?.email ?? 'unknown',
      actorRole: requesterRole,
      action: 'PROGRESS_RESET',
      targetType: 'User',
      targetId: id,
      targetEmail: target?.email ?? 'unknown',
    });

    return { reset: true };
  }
}

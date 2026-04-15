import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type AuditAction =
  | 'USER_CREATED'
  | 'USER_DEACTIVATED'
  | 'PASSWORD_RESET'
  | 'PROGRESS_RESET'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'CHAPTER_UNLOCKED'
  | 'CHAPTER_COMPLETED_ADMIN';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    actorId: string;
    actorEmail: string;
    actorRole: string;
    action: AuditAction;
    targetType?: string;
    targetId?: string;
    targetEmail?: string;
    details?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          actorEmail: params.actorEmail,
          actorRole: params.actorRole,
          action: params.action,
          targetType: params.targetType ?? null,
          targetId: params.targetId ?? null,
          targetEmail: params.targetEmail ?? null,
          details: params.details ?? {},
          ipAddress: params.ipAddress ?? null,
        },
      });
    } catch (e) {
      console.error('AuditLog write failed', e);
    }
  }

  async findAll(params: { page?: number; limit?: number; action?: string; actorId?: string }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.action) where.action = params.action;
    if (params.actorId) where.actorId = params.actorId;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

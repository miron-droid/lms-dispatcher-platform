import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ExamEventListener {
  constructor(
    private notifications: NotificationsService,
    private prisma: PrismaService,
  ) {}

  @OnEvent('exam.requested')
  async onExamRequested(payload: { examId: string; studentId: string; managerId?: string }) {
    const student = await this.prisma.user.findUnique({
      where: { id: payload.studentId },
      select: { firstName: true, lastName: true },
    });

    if (payload.managerId) {
      await this.notifications.sendPush(payload.managerId, {
        title: 'New exam request',
        body: `${student?.firstName} ${student?.lastName} requested an exam`,
        url: '/manager/exams',
      });
    }
  }

  @OnEvent('exam.reviewed')
  async onExamReviewed(payload: { examId: string; studentId: string; decision: string }) {
    await this.notifications.sendPush(payload.studentId, {
      title: `Exam result: ${payload.decision}`,
      body: payload.decision === 'PASS'
        ? 'Congratulations! You passed. Next chapter is unlocked.'
        : payload.decision === 'RETRY'
        ? 'Review the material and try again.'
        : 'Please contact your manager.',
      url: '/progress',
    });
  }
}

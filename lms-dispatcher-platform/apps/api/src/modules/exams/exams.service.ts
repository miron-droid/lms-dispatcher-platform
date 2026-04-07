import {
  Injectable, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestExamDto } from './dto/request-exam.dto';
import { ReviewExamDto } from './dto/review-exam.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamDecision, ExamStatus, ProgressStatus, UserRole } from '../../common/enums';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async request(studentId: string, dto: RequestExamDto) {
    // Student must have passed the test first
    const cp = await this.prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId: studentId, chapterId: dto.chapterId } },
    });
    if (!cp?.testPassed) {
      throw new BadRequestException('You must pass the chapter test before requesting an exam');
    }

    // No pending exam for this chapter
    const existing = await this.prisma.examRequest.findFirst({
      where: {
        studentId,
        chapterId: dto.chapterId,
        status: { in: [ExamStatus.REQUESTED, ExamStatus.SCHEDULED] },
      },
    });
    if (existing) {
      throw new BadRequestException('You already have a pending exam for this chapter');
    }

    // Find student's manager
    const student = await this.prisma.user.findUniqueOrThrow({
      where: { id: studentId },
      select: { managerId: true },
    });

    const exam = await this.prisma.examRequest.create({
      data: {
        studentId,
        managerId: student.managerId ?? undefined,
        chapterId: dto.chapterId,
        scheduledAt: dto.preferredAt ? new Date(dto.preferredAt) : undefined,
      },
    });

    this.events.emit('exam.requested', { examId: exam.id, studentId, managerId: student.managerId });

    return exam;
  }

  async review(examId: string, managerId: string, dto: ReviewExamDto) {
    const exam = await this.prisma.examRequest.findUniqueOrThrow({ where: { id: examId } });

    if (exam.managerId && exam.managerId !== managerId) {
      throw new ForbiddenException('This exam is not assigned to you');
    }
    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('Exam already completed');
    }

    const updated = await this.prisma.examRequest.update({
      where: { id: examId },
      data: {
        decision: dto.decision,
        comment: dto.comment,
        status: ExamStatus.COMPLETED,
        completedAt: new Date(),
        managerId,
      },
    });

    if (dto.decision === ExamDecision.PASS) {
      await this.prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId: exam.studentId, chapterId: exam.chapterId } },
        update: { examPassed: true, status: ProgressStatus.COMPLETED, completedAt: new Date() },
        create: {
          userId: exam.studentId,
          chapterId: exam.chapterId,
          examPassed: true,
          testPassed: true,
          status: ProgressStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      await this.unlockNextChapter(exam.studentId, exam.chapterId);
    }

    if (dto.decision === ExamDecision.DISBAND) {
      await this.prisma.user.update({
        where: { id: exam.studentId },
        data: { isActive: false },
      });
    }

    this.events.emit('exam.reviewed', {
      examId, studentId: exam.studentId, decision: dto.decision,
    });

    return updated;
  }

  private async unlockNextChapter(userId: string, currentChapterId: string) {
    const current = await this.prisma.chapter.findUniqueOrThrow({
      where: { id: currentChapterId },
      select: { order: true, courseId: true },
    });
    const next = await this.prisma.chapter.findFirst({
      where: { courseId: current.courseId, order: current.order + 1 },
      include: {
        lessons: { orderBy: { order: 'asc' }, take: 1 },
      },
    });
    if (!next) return;

    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: next.id } },
      update: { status: ProgressStatus.IN_PROGRESS },
      create: { userId, chapterId: next.id, status: ProgressStatus.IN_PROGRESS },
    });

    if (next.lessons[0]) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: next.lessons[0].id } },
        update: {},
        create: { userId, lessonId: next.lessons[0].id, status: ProgressStatus.IN_PROGRESS },
      });
    }
  }

  getPending(managerId: string) {
    return this.prisma.examRequest.findMany({
      where: { managerId, status: { in: [ExamStatus.REQUESTED, ExamStatus.SCHEDULED] } },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true } },
        chapter: { select: { id: true, title: true, order: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  getMyExams(studentId: string) {
    return this.prisma.examRequest.findMany({
      where: { studentId },
      include: { chapter: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

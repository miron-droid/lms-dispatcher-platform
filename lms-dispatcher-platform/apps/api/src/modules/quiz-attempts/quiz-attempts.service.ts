import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { awardXPAndUpdateStreak, xpForLessonType } from './gamification';
import { UserRole } from '@prisma/client';

@Injectable()
export class QuizAttemptsService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitQuizDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      select: { id: true, type: true, chapterId: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    await this.prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: dto.lessonId,
        score: dto.score,
        totalQuestions: dto.totalQuestions,
        correctAnswers: dto.correctAnswers,
        answers: dto.answers as any,
      },
    });

    const xpEarned = xpForLessonType(lesson.type);
    const result = await awardXPAndUpdateStreak(this.prisma, userId, xpEarned);

    return result;
  }

  myAttempts(userId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        lesson: { select: { id: true, title: true, type: true, chapterId: true } },
      },
    });
  }

  async userAttempts(requesterId: string, requesterRole: UserRole, targetUserId: string) {
    if (requesterRole !== UserRole.ADMIN && requesterRole !== UserRole.MANAGER) {
      throw new ForbiddenException();
    }
    return this.prisma.quizAttempt.findMany({
      where: { userId: targetUserId },
      orderBy: { completedAt: 'desc' },
      include: {
        lesson: { select: { id: true, title: true, type: true, chapterId: true } },
      },
    });
  }
}

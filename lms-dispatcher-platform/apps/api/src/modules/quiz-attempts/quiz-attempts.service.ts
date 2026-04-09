import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { awardXPAndUpdateStreak, xpForLessonType } from './gamification';
import { UserRole } from '@prisma/client';

const PASS_THRESHOLD = 80;

@Injectable()
export class QuizAttemptsService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitQuizDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      select: { id: true, type: true, chapterId: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // Validate payload
    if (!dto.totalQuestions || dto.totalQuestions <= 0) {
      throw new BadRequestException('totalQuestions must be > 0');
    }
    if (dto.correctAnswers < 0 || dto.correctAnswers > dto.totalQuestions) {
      throw new BadRequestException('correctAnswers must be between 0 and totalQuestions');
    }
    if (dto.score < 0 || dto.score > 100) {
      throw new BadRequestException('score must be between 0 and 100');
    }

    // Server-side verification: recompute score from correct/total
    const computedScore = Math.round((dto.correctAnswers / dto.totalQuestions) * 100);
    const verifiedScore = computedScore; // trust server computation, not client

    await this.prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: dto.lessonId,
        score: verifiedScore,
        totalQuestions: dto.totalQuestions,
        correctAnswers: dto.correctAnswers,
        answers: dto.answers as any,
      },
    });

    const passed = verifiedScore >= PASS_THRESHOLD;

    // Only award XP and streak on pass
    if (!passed) {
      // Still fetch current state to return (no mutation)
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { totalXP: true, streak: true, achievements: true },
      });
      return {
        xpEarned: 0,
        totalXP: user.totalXP ?? 0,
        level: Math.floor(((user.totalXP ?? 0) / 500)) + 1,
        streak: user.streak ?? 0,
        newAchievements: [] as string[],
        passed: false,
        score: verifiedScore,
      };
    }

    const xpEarned = xpForLessonType(lesson.type);
    const result = await awardXPAndUpdateStreak(this.prisma, userId, xpEarned);
    return { ...result, passed: true, score: verifiedScore };
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(chapterId: string) {
    const questions = await this.prisma.question.findMany({
      where: { chapterId },
      include: { options: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    // Shuffle and strip isCorrect from client response
    return questions
      .sort(() => Math.random() - 0.5)
      .map((q) => ({
        id: q.id,
        text: q.text,
        isMultiple: q.isMultiple,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      }));
  }

  async submit(chapterId: string, userId: string, dto: SubmitTestDto) {
    const chapter = await this.prisma.chapter.findUniqueOrThrow({
      where: { id: chapterId },
      select: { passThreshold: true },
    });

    const questions = await this.prisma.question.findMany({
      where: { chapterId },
      include: { options: true },
    });

    const results = dto.answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return { questionId: answer.questionId, isCorrect: false };

      const correctIds = new Set(
        question.options.filter((o) => o.isCorrect).map((o) => o.id),
      );
      const selectedIds = new Set(answer.selectedOptionIds);
      const isCorrect =
        correctIds.size === selectedIds.size &&
        [...correctIds].every((id) => selectedIds.has(id));

      return {
        questionId: answer.questionId,
        isCorrect,
        explanation: question.explanation,
        correctOptionIds: [...correctIds],
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= chapter.passThreshold;

    await this.prisma.testAttempt.create({
      data: {
        userId,
        chapterId,
        score,
        passed,
        answers: results,
      },
    });

    if (passed) {
      await this.prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId } },
        update: { testPassed: true },
        create: { userId, chapterId, testPassed: true, status: ProgressStatus.IN_PROGRESS },
      });
    }

    return { score, passed, threshold: chapter.passThreshold, results };
  }

  getAttempts(chapterId: string, userId: string) {
    return this.prisma.testAttempt.findMany({
      where: { chapterId, userId },
      orderBy: { completedAt: 'desc' },
      select: { id: true, score: true, passed: true, completedAt: true },
    });
  }
}

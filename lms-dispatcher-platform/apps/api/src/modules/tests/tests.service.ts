import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { ProgressStatus, ContentStatus } from '@prisma/client';

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
      select: { passThreshold: true, courseId: true, order: true },
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
        selectedOptionIds: answer.selectedOptionIds,
        isCorrect,
        explanation: question.explanation,
        correctOptionIds: [...correctIds],
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalQuestions = questions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
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
      // Mark current chapter COMPLETED with testPassed=true
      await this.completeChapterAndUnlockNext(userId, chapterId, chapter.courseId, chapter.order);
    }

    return {
      score,
      passed,
      threshold: chapter.passThreshold,
      totalQuestions,
      correctAnswers: correctCount,
      results,
    };
  }

  private async completeChapterAndUnlockNext(
    userId: string,
    chapterId: string,
    courseId: string,
    order: number,
  ) {
    const now = new Date();

    // Mark current chapter completed (test passed)
    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: {
        status: ProgressStatus.COMPLETED,
        testPassed: true,
        completedAt: now,
      },
      create: {
        userId,
        chapterId,
        status: ProgressStatus.COMPLETED,
        testPassed: true,
        examPassed: false,
        completedAt: now,
      },
    });

    // Unlock next chapter (if any)
    const nextChapter = await this.prisma.chapter.findFirst({
      where: {
        courseId,
        order: order + 1,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        lessons: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });
    if (!nextChapter) return;

    // Create a row if missing; otherwise only promote LOCKED → IN_PROGRESS
    // (never downgrade an already COMPLETED next chapter).
    const existing = await this.prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId: nextChapter.id } },
    });
    if (!existing) {
      await this.prisma.chapterProgress.create({
        data: {
          userId,
          chapterId: nextChapter.id,
          status: ProgressStatus.IN_PROGRESS,
        },
      });
    } else if (existing.status === ProgressStatus.LOCKED) {
      await this.prisma.chapterProgress.update({
        where: { userId_chapterId: { userId, chapterId: nextChapter.id } },
        data: { status: ProgressStatus.IN_PROGRESS },
      });
    }

    const firstLesson = nextChapter.lessons[0];
    if (firstLesson) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
        update: {},
        create: {
          userId,
          lessonId: firstLesson.id,
          status: ProgressStatus.IN_PROGRESS,
        },
      });
    }
  }

  getAttempts(chapterId: string, userId: string) {
    return this.prisma.testAttempt.findMany({
      where: { chapterId, userId },
      orderBy: { completedAt: 'desc' },
      select: { id: true, score: true, passed: true, completedAt: true },
    });
  }
}

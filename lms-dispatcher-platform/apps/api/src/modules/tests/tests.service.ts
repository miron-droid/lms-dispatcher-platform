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

      // Check if all lessons are also done — if so, complete chapter and unlock next
      const chapterWithLessons = await this.prisma.chapter.findUnique({
        where: { id: chapterId },
        include: {
          lessons: { where: { status: ContentStatus.PUBLISHED } },
        },
      });
      if (chapterWithLessons) {
        const allProgress = await this.prisma.lessonProgress.findMany({
          where: { userId, lessonId: { in: chapterWithLessons.lessons.map((l) => l.id) } },
        });
        const allDone = chapterWithLessons.lessons.every((l) =>
          allProgress.find((p) => p.lessonId === l.id)?.status === ProgressStatus.COMPLETED,
        );
        if (allDone) {
          await this.completeChapterAndUnlockNext(userId, chapterId);
        }
      }
    }

    return { score, passed, threshold: chapter.passThreshold, results };
  }

  private async completeChapterAndUnlockNext(userId: string, chapterId: string) {
    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: { status: ProgressStatus.COMPLETED, examPassed: true },
      create: { userId, chapterId, status: ProgressStatus.COMPLETED, testPassed: true, examPassed: true },
    });

    const currentChapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { courseId: true, order: true },
    });
    if (!currentChapter) return;

    const nextChapter = await this.prisma.chapter.findFirst({
      where: { courseId: currentChapter.courseId, order: currentChapter.order + 1, status: ContentStatus.PUBLISHED },
      include: {
        lessons: { where: { status: ContentStatus.PUBLISHED }, orderBy: { order: 'asc' }, take: 1 },
      },
    });
    if (!nextChapter) return;

    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: nextChapter.id } },
      update: {},
      create: { userId, chapterId: nextChapter.id, status: ProgressStatus.IN_PROGRESS },
    });

    const firstLesson = nextChapter.lessons[0];
    if (firstLesson) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
        update: {},
        create: { userId, lessonId: firstLesson.id, status: ProgressStatus.IN_PROGRESS },
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

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const TOTAL_EXAMS = 20;
const QUESTIONS_PER_EXAM = 15;
const PASS_THRESHOLD = 80;

@Injectable()
export class DailyExamsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all daily exams for a student.
   * Auto-creates/unlocks exams based on days since all chapters completed.
   */
  async getExams(userId: string) {
    // Check if all 9 chapters completed
    const completedChapters = await this.prisma.chapterProgress.count({
      where: { userId, status: 'COMPLETED', examPassed: true },
    });

    if (completedChapters < 9) {
      return { unlocked: false, completedChapters, exams: [] };
    }

    // Find when last chapter was completed (start of exam period)
    const lastChapter = await this.prisma.chapterProgress.findFirst({
      where: { userId, status: 'COMPLETED' },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });

    const startDate = lastChapter?.updatedAt ?? new Date();
    const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    const examsToUnlock = Math.min(daysSinceStart + 1, TOTAL_EXAMS); // +1 because day 0 = first exam

    // Create missing exam slots
    for (let i = 1; i <= examsToUnlock; i++) {
      const unlockDate = new Date(startDate.getTime() + (i - 1) * 86400000);
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO "DailyExam" (id, "userId", "examNumber", "unlockedAt", "createdAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3, NOW())
        ON CONFLICT ("userId", "examNumber") DO NOTHING
      `, userId, i, unlockDate);
    }

    // Fetch all exams
    const exams = await this.prisma.$queryRawUnsafe(`
      SELECT id, "examNumber", score, passed, "completedAt", "unlockedAt"
      FROM "DailyExam"
      WHERE "userId" = $1
      ORDER BY "examNumber" ASC
    `, userId) as any[];

    return {
      unlocked: true,
      total: TOTAL_EXAMS,
      available: examsToUnlock,
      completed: exams.filter((e: any) => e.completedAt).length,
      passed: exams.filter((e: any) => e.passed).length,
      exams,
    };
  }

  /**
   * Get questions for a specific daily exam.
   * Questions pulled randomly from ALL chapters.
   */
  async getQuestions(userId: string, examNumber: number) {
    // Verify exam is unlocked
    const exam = await this.prisma.$queryRawUnsafe(`
      SELECT id, "completedAt" FROM "DailyExam"
      WHERE "userId" = $1 AND "examNumber" = $2
    `, userId, examNumber) as any[];

    if (!exam.length) throw new ForbiddenException('Exam not unlocked yet');
    if (exam[0].completedAt) throw new ForbiddenException('Exam already completed');

    // Get random questions from all chapters
    const questions = await this.prisma.question.findMany({
      include: { options: { orderBy: { order: 'asc' } } },
    });

    // Shuffle and pick QUESTIONS_PER_EXAM
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_EXAM);

    return shuffled.map(q => ({
      id: q.id,
      text: q.text,
      isMultiple: q.isMultiple,
      options: q.options.map(o => ({ id: o.id, text: o.text })),
    }));
  }

  /**
   * Submit answers for a daily exam.
   */
  async submit(userId: string, examNumber: number, answers: { questionId: string; selectedOptionIds: string[] }[]) {
    // Verify exam exists and not completed
    const exam = await this.prisma.$queryRawUnsafe(`
      SELECT id, "completedAt" FROM "DailyExam"
      WHERE "userId" = $1 AND "examNumber" = $2
    `, userId, examNumber) as any[];

    if (!exam.length) throw new ForbiddenException('Exam not unlocked yet');
    if (exam[0].completedAt) throw new ForbiddenException('Exam already completed');

    // Grade answers
    const questions = await this.prisma.question.findMany({
      where: { id: { in: answers.map(a => a.questionId) } },
      include: { options: true },
    });

    const results = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return { questionId: answer.questionId, isCorrect: false };

      const correctIds = new Set(question.options.filter(o => o.isCorrect).map(o => o.id));
      const selectedIds = new Set(answer.selectedOptionIds);
      const isCorrect = correctIds.size === selectedIds.size &&
        [...correctIds].every(id => selectedIds.has(id));

      return {
        questionId: answer.questionId,
        isCorrect,
        explanation: question.explanation,
        correctOptionIds: [...correctIds],
      };
    });

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / answers.length) * 100);
    const passed = score >= PASS_THRESHOLD;

    // Update exam record
    await this.prisma.$executeRawUnsafe(`
      UPDATE "DailyExam"
      SET score = $1, passed = $2, answers = $3, "completedAt" = NOW()
      WHERE "userId" = $4 AND "examNumber" = $5
    `, score, passed, JSON.stringify(results), userId, examNumber);

    return { score, passed, threshold: PASS_THRESHOLD, results };
  }

  /**
   * Get daily exam stats for all students (manager view).
   */
  async getAllStats() {
    const stats = await this.prisma.$queryRawUnsafe(`
      SELECT
        u.id,
        u."firstName" || ' ' || u."lastName" as name,
        COUNT(de.id)::int as total,
        COUNT(de."completedAt")::int as completed,
        COUNT(CASE WHEN de.passed THEN 1 END)::int as passed,
        COALESCE(AVG(CASE WHEN de."completedAt" IS NOT NULL THEN de.score END)::int, 0) as "avgScore"
      FROM "User" u
      LEFT JOIN "DailyExam" de ON de."userId" = u.id
      WHERE u.role = 'STUDENT' AND u."isActive" = true
      GROUP BY u.id, u."firstName", u."lastName"
      ORDER BY passed DESC, "avgScore" DESC
    `) as any[];

    return stats;
  }
}

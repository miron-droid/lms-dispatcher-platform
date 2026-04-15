import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { awardXPAndUpdateStreak, xpForLessonType, levelFromXP } from "./gamification";
import { UserRole } from "@prisma/client";

const PASS_THRESHOLD = 80;

// Shape of an enriched, graded answer that we persist to DB AND
// echo back on submit so the client can render a per-question review.
export interface GradedAnswer {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation?: string;
}

// Lightweight shape extracted from Lesson.content.quiz.questions.
interface RawQuizQuestion {
  id: string;
  correctIndex: number;
  explanation?: string;
}

/**
 * Pull quiz questions out of Lesson.content JSON blob.
 * Returns [] if the lesson has no quiz (e.g. non-text lesson).
 */
function extractQuizQuestions(content: unknown): RawQuizQuestion[] {
  if (!content || typeof content !== "object") return [];
  const c = content as { quiz?: { questions?: unknown } };
  const questions = c.quiz?.questions;
  if (!Array.isArray(questions)) return [];
  return questions
    .filter((q): q is { id: string; correctIndex: number; explanation?: string } =>
      !!q &&
      typeof q === "object" &&
      typeof (q as any).id === "string" &&
      typeof (q as any).correctIndex === "number",
    )
    .map((q) => ({ id: q.id, correctIndex: q.correctIndex, explanation: (q as any).explanation }));
}

/**
 * Normalise the various answer formats the frontend may send
 * into a uniform { questionId, selectedIndex }[] for grading.
 *
 * Supported inputs:
 *   1. Rich:   [{ questionId: "q1", selectedIndex: 0 }, ...]
 *   2. Legacy: [0, 1, 2, 0]   -- index aligned to questions[] order
 *   3. Map:    { q1: 0, q2: 1 }
 */
function normaliseAnswers(
  raw: unknown,
  questions: RawQuizQuestion[],
): Array<{ questionId: string; selectedIndex: number }> {
  if (Array.isArray(raw)) {
    // Rich format?
    if (raw.length > 0 && typeof raw[0] === "object" && raw[0] !== null) {
      return raw
        .map((a: any) => ({
          questionId: String(a?.questionId ?? ""),
          selectedIndex: Number(a?.selectedIndex),
        }))
        .filter((a) => a.questionId && Number.isFinite(a.selectedIndex));
    }
    // Legacy number[] — align with questions[] order
    return raw
      .map((idx, i) => ({
        questionId: questions[i]?.id ?? `_idx_${i}`,
        selectedIndex: Number(idx),
      }))
      .filter((a) => Number.isFinite(a.selectedIndex));
  }

  if (raw && typeof raw === "object") {
    // Map format { questionId: index }
    return Object.entries(raw as Record<string, unknown>)
      .map(([questionId, v]) => ({
        questionId,
        selectedIndex: Array.isArray(v) ? Number(v[0]) : Number(v),
      }))
      .filter((a) => Number.isFinite(a.selectedIndex));
  }

  return [];
}

@Injectable()
export class QuizAttemptsService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitQuizDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      select: { id: true, type: true, chapterId: true, content: true },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");

    // Basic payload sanity
    if (!dto.totalQuestions || dto.totalQuestions <= 0) {
      throw new BadRequestException("totalQuestions must be > 0");
    }
    if (dto.correctAnswers < 0 || dto.correctAnswers > dto.totalQuestions) {
      throw new BadRequestException("correctAnswers must be between 0 and totalQuestions");
    }
    if (dto.score < 0 || dto.score > 100) {
      throw new BadRequestException("score must be between 0 and 100");
    }

    // Pull the canonical quiz definition from the lesson itself, so we
    // can grade each answer on the server and never trust the client.
    const quizQuestions = extractQuizQuestions(lesson.content);
    const correctIndexById = new Map<string, number>();
    const explanationById = new Map<string, string | undefined>();
    for (const q of quizQuestions) {
      correctIndexById.set(q.id, q.correctIndex);
      explanationById.set(q.id, q.explanation);
    }

    // Normalise + grade the submitted answers.
    const submitted = normaliseAnswers(dto.answers, quizQuestions);
    const graded: GradedAnswer[] = submitted.map((a) => {
      const correctIndex = correctIndexById.has(a.questionId)
        ? (correctIndexById.get(a.questionId) as number)
        : -1;
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correctIndex,
        isCorrect: correctIndex >= 0 && a.selectedIndex === correctIndex,
        explanation: explanationById.get(a.questionId),
      };
    });

    // Server-authoritative score + correct count.
    // When we have a canonical quiz definition, use its length as the
    // denominator; otherwise fall back to the client-declared total.
    const totalQuestions =
      quizQuestions.length > 0 ? quizQuestions.length : dto.totalQuestions;
    const correctAnswers = graded.filter((g) => g.isCorrect).length;
    const verifiedScore =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    await this.prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: dto.lessonId,
        score: verifiedScore,
        totalQuestions,
        correctAnswers,
        // Persist the enriched, per-question graded answers so the
        // analytics dashboard can compute question-level statistics.
        answers: graded as unknown as any,
      },
    });

    const passed = verifiedScore >= PASS_THRESHOLD;

    if (!passed) {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { totalXP: true, streak: true, achievements: true },
      });
      return {
        xpEarned: 0,
        totalXP: user.totalXP ?? 0,
        level: levelFromXP(user.totalXP ?? 0),
        streak: user.streak ?? 0,
        newAchievements: [] as string[],
        passed: false,
        score: verifiedScore,
        correctAnswers,
        totalQuestions,
        // Per-question review so the client can show exactly which
        // answers were wrong and what the correct answer was.
        gradedAnswers: graded,
      };
    }

    const xpEarned = xpForLessonType(lesson.type);
    const result = await awardXPAndUpdateStreak(this.prisma, userId, xpEarned);
    return {
      ...result,
      passed: true,
      score: verifiedScore,
      correctAnswers,
      totalQuestions,
      // Per-question review — even on a pass we show it so the student
      // can learn from the 1-2 questions they got wrong.
      gradedAnswers: graded,
    };
  }

  myAttempts(userId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
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
      orderBy: { completedAt: "desc" },
      include: {
        lesson: { select: { id: true, title: true, type: true, chapterId: true } },
      },
    });
  }
}

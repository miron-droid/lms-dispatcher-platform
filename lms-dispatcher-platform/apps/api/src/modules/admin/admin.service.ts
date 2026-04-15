import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertChapterDto } from './dto/upsert-chapter.dto';
import { UpsertLessonDto } from './dto/upsert-lesson.dto';
import { ContentStatus } from '../../common/enums';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard — filtered by company for non-SUPER_ADMIN
  getDashboard(companyId?: string | null) {
    const userWhere: any = { role: 'STUDENT', isActive: true };
    if (companyId) userWhere.companyId = companyId;

    return Promise.all([
      this.prisma.user.count({ where: userWhere }),
      this.prisma.testAttempt.aggregate({
        _avg: { score: true },
        ...(companyId ? { where: { user: { companyId } } } : {}),
      }),
      this.prisma.examRequest.count({
        where: {
          status: 'REQUESTED',
          ...(companyId ? { student: { companyId } } : {}),
        },
      }),
      this.prisma.examRequest.count({
        where: {
          decision: 'PASS',
          ...(companyId ? { student: { companyId } } : {}),
        },
      }),
    ]).then(([students, avgScore, pendingExams, passedExams]) => ({
      activeStudents: students,
      avgTestScore: Math.round(avgScore._avg.score ?? 0),
      pendingExams,
      passedExams,
    }));
  }

  // Chapters
  upsertChapter(courseId: string, dto: UpsertChapterDto) {
    if (dto.id) {
      return this.prisma.chapter.update({ where: { id: dto.id }, data: dto });
    }
    return this.prisma.chapter.create({ data: { courseId, ...dto } });
  }

  // Lessons
  upsertLesson(chapterId: string, dto: UpsertLessonDto) {
    const { id, content, ...rest } = dto;
    const data = {
      ...rest,
      ...(content !== undefined && { content: content as object }),
    };
    if (id) {
      return this.prisma.lesson.update({ where: { id }, data });
    }
    return this.prisma.lesson.create({ data: { chapterId, ...data } });
  }

  deleteLesson(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }

  // Questions
  getQuestions(chapterId: string) {
    return this.prisma.question.findMany({
      where: { chapterId },
      include: { options: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }

  async upsertQuestion(chapterId: string, data: any) {
    const { id, options, ...rest } = data;
    if (id) {
      await this.prisma.questionOption.deleteMany({ where: { questionId: id } });
      return this.prisma.question.update({
        where: { id },
        data: {
          ...rest,
          options: { create: options },
        },
        include: { options: true },
      });
    }
    return this.prisma.question.create({
      data: { chapterId, ...rest, options: { create: options } },
      include: { options: true },
    });
  }

  deleteQuestion(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }

  // Detailed progress per student per chapter/lesson — filtered by company
  async getDetailedProgress(companyId?: string | null) {
    const userWhere: any = { role: 'STUDENT', isActive: true };
    if (companyId) userWhere.companyId = companyId;

    const students = await this.prisma.user.findMany({
      where: userWhere,
      select: {
        id: true, firstName: true, lastName: true, lastActiveAt: true,
        chapterProgress: {
          select: { chapterId: true, status: true, testPassed: true, examPassed: true },
        },
        lessonProgress: {
          select: { lessonId: true, status: true },
        },
        testAttempts: {
          select: { chapterId: true, score: true, passed: true },
          orderBy: { completedAt: 'desc' },
        },
        quizAttempts: {
          select: { lessonId: true, score: true },
        },
        totalXP: true,
        streak: true,
      },
    });

    return students.map(s => {
      // Build per-chapter detail
      const chapters = Array.from({ length: 9 }, (_, i) => {
        const chId = `chapter-${i + 1}`;
        const cp = s.chapterProgress.find(c => c.chapterId === chId);
        const lessons = Array.from({ length: 4 }, (_, j) => {
          const lId = `lesson-${i + 1}-${j + 1}`;
          const lp = s.lessonProgress.find(l => l.lessonId === lId);
          return { id: lId, status: lp?.status ?? 'LOCKED' };
        });
        const bestTest = s.testAttempts.filter(t => t.chapterId === chId).sort((a, b) => b.score - a.score)[0];
        return {
          chapter: i + 1,
          status: cp?.status ?? 'LOCKED',
          testPassed: cp?.testPassed ?? false,
          examPassed: cp?.examPassed ?? false,
          testScore: bestTest?.score ?? null,
          lessons,
        };
      });

      const completedChapters = chapters.filter(c => c.status === "COMPLETED" || c.testPassed || c.examPassed).length;
      const scores = s.testAttempts.map(t => t.score);
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      const totalLessons = s.lessonProgress.filter(l => l.status === 'COMPLETED').length;

      return {
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        lastActiveAt: s.lastActiveAt,
        completedChapters,
        totalLessons,
        avgScore,
        testAttemptsCount: s.testAttempts.length,
        testsPassedCount: s.testAttempts.filter(t => t.passed).length,
        quizAttemptsCount: s.quizAttempts.length,
        totalXP: s.totalXP ?? 0,
        streak: s.streak ?? 0,
        chapters,
      };
    });
  }

  // Per-student detail report
  async getStudentDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastActiveAt: true,
        totalXP: true,
        streak: true,
        lastStudyDate: true,
        achievements: true,
      },
    });
    if (!user) throw new NotFoundException('Student not found');

    // Pull all PUBLISHED chapters with their lessons + question count
    const chapters = await this.prisma.chapter.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          where: { status: ContentStatus.PUBLISHED },
          select: { id: true, title: true, order: true },
        },
      },
    });

    const chapterIds = chapters.map((c) => c.id);
    const lessonIds = chapters.flatMap((c) => c.lessons.map((l) => l.id));

    const [chapterProgress, lessonProgress, attempts, quizAttempts] = await Promise.all([
      this.prisma.chapterProgress.findMany({
        where: { userId, chapterId: { in: chapterIds } },
      }),
      this.prisma.lessonProgress.findMany({
        where: { userId, lessonId: { in: lessonIds } },
      }),
      this.prisma.testAttempt.findMany({
        where: { userId, chapterId: { in: chapterIds } },
        orderBy: { completedAt: 'desc' },
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId, lessonId: { in: lessonIds } },
        orderBy: { completedAt: 'desc' },
      }),
    ]);
    const quizByLesson: Record<string, any[]> = {};
    for (const qa of quizAttempts) {
      (quizByLesson[qa.lessonId] ||= []).push({
        id: qa.id,
        score: qa.score,
        totalQuestions: qa.totalQuestions,
        correctAnswers: qa.correctAnswers,
        completedAt: qa.completedAt,
      });
    }

    const cpMap = new Map(chapterProgress.map((cp) => [cp.chapterId, cp]));
    const lpMap = new Map(lessonProgress.map((lp) => [lp.lessonId, lp]));

    const chaptersOut = chapters.map((ch, idx) => {
      const cp = cpMap.get(ch.id);
      const prevCh = idx > 0 ? chapters[idx - 1] : null;
      const prevCp = prevCh ? cpMap.get(prevCh.id) : null;
      const isFirst = idx === 0;
      const prevCompleted =
        !!prevCp && prevCp.status === ProgressStatus.COMPLETED && prevCp.testPassed === true;
      const isLocked = !isFirst && !prevCompleted;

      let status: ProgressStatus | 'LOCKED';
      if (cp?.status === ProgressStatus.COMPLETED) status = ProgressStatus.COMPLETED;
      else if (isLocked) status = ProgressStatus.LOCKED;
      else status = cp?.status ?? ProgressStatus.IN_PROGRESS;

      const lessonsCompleted = ch.lessons.filter(
        (l) => lpMap.get(l.id)?.status === ProgressStatus.COMPLETED,
      ).length;

      const chAttempts = attempts
        .filter((a) => a.chapterId === ch.id)
        .map((a) => {
          const answers = Array.isArray(a.answers) ? (a.answers as any[]) : [];
          const correct = answers.filter((x) => x && x.isCorrect).length;
          return {
            id: a.id,
            score: a.score,
            passed: a.passed,
            completedAt: a.completedAt,
            totalQuestions: answers.length,
            correctAnswers: correct,
          };
        });

      // Aggregate quiz attempts per lesson within this chapter
      const chQuizAttempts = ch.lessons
        .map((lesson) => {
          const lessonAttempts = quizByLesson[lesson.id] || [];
          if (lessonAttempts.length === 0) return null;
          const scores = lessonAttempts.map((a: any) => a.score);
          const bestScore = Math.max(...scores);
          const sorted = [...lessonAttempts].sort(
            (a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
          );
          const lastAttempt = sorted[0];
          return {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonOrder: lesson.order,
            attempts: lessonAttempts.length,
            bestScore,
            lastScore: lastAttempt.score,
            lastAttemptAt: lastAttempt.completedAt,
          };
        })
        .filter((x: any) => x !== null)
        .sort((a: any, b: any) => a.lessonOrder - b.lessonOrder);

      return {
        id: ch.id,
        order: ch.order,
        title: ch.title,
        status,
        lessonsCompleted,
        totalLessons: ch.lessons.length,
        testPassed: cp?.testPassed ?? false,
        examPassed: cp?.examPassed ?? false,
        completedAt: cp?.completedAt ?? null,
        testAttempts: chAttempts,
        quizAttempts: chQuizAttempts,
      };
    });

    const totalChapters = chapters.length;
    const chaptersCompleted = chaptersOut.filter((c) => c.status === ProgressStatus.COMPLETED).length;
    const totalLessons = lessonIds.length;
    const lessonsCompleted = chaptersOut.reduce((acc, c) => acc + c.lessonsCompleted, 0);
    const testAttemptsCount = attempts.length;
    const testsPassed = attempts.filter((a) => a.passed).length;
    const averageScore = attempts.length
      ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length)
      : 0;

    // Server-derived level
    const level = (() => {
      const xp = user.totalXP ?? 0;
      let l = 1;
      while ((l * (l + 1) * 500) / 2 <= xp) l++;
      return l;
    })();

    return {
      user,
      gamification: {
        totalXP: user.totalXP ?? 0,
        streak: user.streak ?? 0,
        lastStudyDate: user.lastStudyDate,
        achievements: user.achievements ?? [],
        level,
      },
      summary: {
        totalChapters,
        chaptersCompleted,
        totalLessons,
        lessonsCompleted,
        testAttempts: testAttemptsCount,
        testsPassed,
        averageScore,
      },
      chapters: chaptersOut,
      quizAttemptsByLesson: quizByLesson,
    };
  }

  // Analytics — filtered by company
  async getStudentAnalytics(companyId?: string | null) {
    const userWhere: any = { role: 'STUDENT', isActive: true };
    if (companyId) userWhere.companyId = companyId;

    const students = await this.prisma.user.findMany({
      where: userWhere,
      select: {
        id: true, firstName: true, lastName: true, lastActiveAt: true,
        chapterProgress: { select: { status: true, testPassed: true, examPassed: true } },
        testAttempts: { select: { score: true, passed: true }, orderBy: { completedAt: 'desc' } },
        examRequests: { select: { decision: true, status: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    return students.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      lastActiveAt: s.lastActiveAt,
      chaptersCompleted: s.chapterProgress.filter((c) => c.status === 'COMPLETED' || c.testPassed || c.examPassed).length,
      avgTestScore: s.testAttempts.length
        ? Math.round(s.testAttempts.reduce((acc, t) => acc + t.score, 0) / s.testAttempts.length)
        : null,
      lastExamDecision: s.examRequests[0]?.decision ?? null,
    }));
  }

  // ── Manager unlock / complete chapter ────────────────────────────────────
  async unlockChapter(userId: string, chapterId: string) {
    const result = await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: { status: ProgressStatus.IN_PROGRESS },
      create: { userId, chapterId, status: ProgressStatus.IN_PROGRESS },
    });
    // Also unlock the first lesson of this chapter so student can enter
    const firstLesson = await this.prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { order: 'asc' },
      select: { id: true },
    });
    if (firstLesson) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
        update: {},
        create: { userId, lessonId: firstLesson.id, status: ProgressStatus.IN_PROGRESS },
      });
    }
    return result;
  }

  async completeChapter(userId: string, chapterId: string) {
    return this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: {
        status: ProgressStatus.COMPLETED,
        testPassed: true,
        examPassed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        chapterId,
        status: ProgressStatus.COMPLETED,
        testPassed: true,
        examPassed: true,
        completedAt: new Date(),
      },
    });
  }

  // ── Owner-only: Managers Overview ────────────────────────────────────────
  async getManagersOverview(companyId?: string | null) {
    const managerWhere: any = { role: { in: ['ADMIN', 'MANAGER'] }, isActive: true };
    if (companyId) managerWhere.companyId = companyId;

    const managers = await this.prisma.user.findMany({
      where: managerWhere,
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        createdAt: true, lastActiveAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const result = await Promise.all(managers.map(async (m) => {
      const studentCount = await this.prisma.user.count({
        where: { managerId: m.id, isActive: true, role: 'STUDENT' },
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const actionCount = await this.prisma.auditLog.count({
        where: { actorId: m.id, createdAt: { gte: thirtyDaysAgo } },
      });

      const lastLogin = await this.prisma.auditLog.findFirst({
        where: { actorId: m.id, action: 'LOGIN_SUCCESS' },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, ipAddress: true },
      });

      return {
        ...m,
        studentCount,
        actionsLast30d: actionCount,
        lastLogin: lastLogin?.createdAt ?? null,
        lastLoginIp: lastLogin?.ipAddress ?? null,
      };
    }));

    return result;
  }

  // ── Owner-only: Manager's Students ───────────────────────────────────────
  async getManagerStudents(managerId: string) {
    return this.prisma.user.findMany({
      where: { managerId, role: 'STUDENT', isActive: true },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        createdAt: true, lastActiveAt: true, totalXP: true, streak: true,
        chapterProgress: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Owner-only: Manager Activity Log ─────────────────────────────────────
  async getManagerActivity(managerId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { actorId: managerId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.auditLog.count({ where: { actorId: managerId } }),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Owner-only: Platform Stats ───────────────────────────────────────────
  async getOwnerStats(companyId?: string | null) {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const weekAgo = new Date(Date.now() - 7 * 86400000);

    const companyFilter: any = companyId ? { companyId } : {};

    const [totalUsers, totalStudents, totalAdmins, totalManagers,
           activeToday, usersCreatedThisWeek, loginsToday] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true, ...companyFilter } }),
      this.prisma.user.count({ where: { role: 'STUDENT', isActive: true, ...companyFilter } }),
      this.prisma.user.count({ where: { role: 'ADMIN', isActive: true, ...companyFilter } }),
      this.prisma.user.count({ where: { role: 'MANAGER', isActive: true, ...companyFilter } }),
      this.prisma.user.count({
        where: { lastActiveAt: { gte: todayStart }, ...companyFilter },
      }),
      this.prisma.auditLog.count({
        where: {
          action: 'USER_CREATED',
          createdAt: { gte: weekAgo },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          action: 'LOGIN_SUCCESS',
          createdAt: { gte: todayStart },
        },
      }),
    ]);

    return { totalUsers, totalStudents, totalAdmins, totalManagers, activeToday, usersCreatedThisWeek, loginsToday };
  }

  // ── Owner-only: Combined Control Data ────────────────────────────────────
  async getControlData(companyId?: string | null) {
    const userWhere: any = { isActive: true };
    if (companyId) userWhere.companyId = companyId;

    const [users, stats, recentEvents] = await Promise.all([
      // All users with progress data
      this.prisma.user.findMany({
        where: userWhere,
        select: {
          id: true, email: true, firstName: true, lastName: true, role: true,
          createdAt: true, lastActiveAt: true, totalXP: true, streak: true,
          managerId: true, companyId: true,
        },
        orderBy: { lastActiveAt: { sort: 'desc', nulls: 'last' } },
      }),
      // Stats
      Promise.all([
        this.prisma.user.count({ where: { isActive: true, ...userWhere } }),
        this.prisma.user.count({
          where: { lastActiveAt: { gte: new Date(Date.now() - 7 * 86400000) }, isActive: true, ...(companyId ? { companyId } : {}) },
        }),
        this.prisma.user.aggregate({ where: { role: 'STUDENT', isActive: true, ...(companyId ? { companyId } : {}) }, _avg: { totalXP: true } }),
        this.prisma.auditLog.count({
          where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        }),
      ]),
      // Last 50 audit events
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    const userList = users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
      totalXP: u.totalXP,
      streak: u.streak,
      managerId: u.managerId,
      companyId: u.companyId,
      studentsCount: u.role !== 'STUDENT'
        ? users.filter(s => s.managerId === u.id && s.role === 'STUDENT').length
        : undefined,
    }));

    return {
      stats: {
        totalUsers: stats[0],
        activeLast7d: stats[1],
        avgStudentXP: Math.round(stats[2]._avg.totalXP ?? 0),
        eventsToday: stats[3],
      },
      users: userList,
      recentEvents,
    };
  }
}

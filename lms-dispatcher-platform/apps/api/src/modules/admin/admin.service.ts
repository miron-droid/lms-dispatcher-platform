import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertChapterDto } from './dto/upsert-chapter.dto';
import { UpsertLessonDto } from './dto/upsert-lesson.dto';
import { ContentStatus } from '../../common/enums';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard
  getDashboard() {
    return Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      this.prisma.testAttempt.aggregate({ _avg: { score: true } }),
      this.prisma.examRequest.count({ where: { status: 'REQUESTED' } }),
      this.prisma.examRequest.count({ where: { decision: 'PASS' } }),
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

  // Detailed progress per student per chapter/lesson
  async getDetailedProgress() {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT', isActive: true },
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

      const completedChapters = chapters.filter(c => c.examPassed).length;
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
        chapters,
      };
    });
  }

  // Analytics
  async getStudentAnalytics() {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT', isActive: true },
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
      chaptersCompleted: s.chapterProgress.filter((c) => c.examPassed).length,
      avgTestScore: s.testAttempts.length
        ? Math.round(s.testAttempts.reduce((acc, t) => acc + t.score, 0) / s.testAttempts.length)
        : null,
      lastExamDecision: s.examRequests[0]?.decision ?? null,
    }));
  }
}

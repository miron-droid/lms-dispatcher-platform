import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertChapterDto } from './dto/upsert-chapter.dto';
import { UpsertLessonDto } from './dto/upsert-lesson.dto';
import { ContentStatus } from '@prisma/client';

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
    if (dto.id) {
      return this.prisma.lesson.update({ where: { id: dto.id }, data: dto });
    }
    return this.prisma.lesson.create({ data: { chapterId, ...dto } });
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

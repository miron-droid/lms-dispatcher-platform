import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // 1. Daily activity for the last N days
  async getActivity(days: number) {
    const n = Math.max(1, Math.min(365, days || 30));

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      WITH date_series AS (
        SELECT generate_series(
          (CURRENT_DATE - (($1::int - 1) || ' days')::interval)::date,
          CURRENT_DATE,
          '1 day'::interval
        )::date AS day
      ),
      lessons AS (
        SELECT DATE_TRUNC('day', "completedAt")::date AS day,
               COUNT(*)::int AS cnt,
               COUNT(DISTINCT "userId")::int AS users
        FROM "LessonProgress"
        WHERE "completedAt" IS NOT NULL
          AND "completedAt" >= (CURRENT_DATE - (($1::int - 1) || ' days')::interval)
        GROUP BY 1
      ),
      quizzes AS (
        SELECT DATE_TRUNC('day', "completedAt")::date AS day,
               COUNT(*)::int AS cnt,
               COUNT(DISTINCT "userId")::int AS users
        FROM "QuizAttempt"
        WHERE "completedAt" IS NOT NULL
          AND "completedAt" >= (CURRENT_DATE - (($1::int - 1) || ' days')::interval)
        GROUP BY 1
      ),
      tests AS (
        SELECT DATE_TRUNC('day', "completedAt")::date AS day,
               COUNT(*)::int AS cnt,
               COUNT(DISTINCT "userId")::int AS users
        FROM "TestAttempt"
        WHERE "completedAt" >= (CURRENT_DATE - (($1::int - 1) || ' days')::interval)
        GROUP BY 1
      ),
      active AS (
        SELECT day, COUNT(DISTINCT uid)::int AS active_users FROM (
          SELECT DATE_TRUNC('day', "completedAt")::date AS day, "userId" AS uid
          FROM "LessonProgress"
          WHERE "completedAt" IS NOT NULL
            AND "completedAt" >= (CURRENT_DATE - (($1::int - 1) || ' days')::interval)
          UNION ALL
          SELECT DATE_TRUNC('day', "completedAt")::date AS day, "userId" AS uid
          FROM "QuizAttempt"
          WHERE "completedAt" IS NOT NULL
            AND "completedAt" >= (CURRENT_DATE - (($1::int - 1) || ' days')::interval)
          UNION ALL
          SELECT DATE_TRUNC('day', "completedAt")::date AS day, "userId" AS uid
          FROM "TestAttempt"
          WHERE "completedAt" >= (CURRENT_DATE - (($1::int - 1) || ' days')::interval)
        ) u
        GROUP BY day
      )
      SELECT
        TO_CHAR(ds.day, 'YYYY-MM-DD') AS date,
        COALESCE(l.cnt, 0)::int AS "lessonsCompleted",
        COALESCE(q.cnt, 0)::int AS "quizAttempts",
        COALESCE(t.cnt, 0)::int AS "testAttempts",
        COALESCE(a.active_users, 0)::int AS "activeUsers"
      FROM date_series ds
      LEFT JOIN lessons l ON l.day = ds.day
      LEFT JOIN quizzes q ON q.day = ds.day
      LEFT JOIN tests t ON t.day = ds.day
      LEFT JOIN active a ON a.day = ds.day
      ORDER BY ds.day ASC;
    `, n);

    return { days: rows };
  }

  // 2. Heatmap by hour x day of week (last 30 days)
  async getHeatmap() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      WITH events AS (
        SELECT "completedAt" AS ts FROM "LessonProgress"
        WHERE "completedAt" IS NOT NULL
          AND "completedAt" >= (CURRENT_DATE - INTERVAL '30 days')
        UNION ALL
        SELECT "completedAt" AS ts FROM "QuizAttempt"
        WHERE "completedAt" IS NOT NULL
          AND "completedAt" >= (CURRENT_DATE - INTERVAL '30 days')
      ),
      agg AS (
        SELECT
          EXTRACT(HOUR FROM ts)::int AS hour,
          EXTRACT(DOW FROM ts)::int AS day,
          COUNT(*)::int AS cnt
        FROM events
        GROUP BY 1, 2
      ),
      grid AS (
        SELECT h.hour, d.day
        FROM generate_series(0, 23) AS h(hour)
        CROSS JOIN generate_series(0, 6) AS d(day)
      )
      SELECT g.hour, g.day, COALESCE(a.cnt, 0)::int AS count
      FROM grid g
      LEFT JOIN agg a ON a.hour = g.hour AND a.day = g.day
      ORDER BY g.day, g.hour;
    `);

    const max = rows.reduce((m, r) => Math.max(m, Number(r.count) || 0), 0);
    return { heatmap: rows, max };
  }

  // 3. Conversion funnel
  async getFunnel() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      WITH students AS (
        SELECT id FROM "User" WHERE role = 'STUDENT' AND "isActive" = true
      ),
      total AS (SELECT COUNT(*)::int AS c FROM students),
      started AS (
        SELECT COUNT(DISTINCT lp."userId")::int AS c
        FROM "LessonProgress" lp
        JOIN students s ON s.id = lp."userId"
        WHERE lp.status IN ('IN_PROGRESS', 'COMPLETED')
      ),
      completed_chapters AS (
        SELECT lp."userId", c.id AS chapter_id
        FROM "LessonProgress" lp
        JOIN "Lesson" l ON l.id = lp."lessonId"
        JOIN "Chapter" c ON c.id = l."chapterId"
        JOIN students s ON s.id = lp."userId"
        WHERE lp.status = 'COMPLETED'
        GROUP BY lp."userId", c.id
        HAVING COUNT(DISTINCT lp."lessonId") = (
          SELECT COUNT(*) FROM "Lesson" l2 WHERE l2."chapterId" = c.id
        )
      ),
      per_user AS (
        SELECT "userId", COUNT(DISTINCT chapter_id)::int AS done
        FROM completed_chapters
        GROUP BY "userId"
      ),
      total_chapters AS (SELECT COUNT(*)::int AS c FROM "Chapter"),
      ch1 AS (
        SELECT COUNT(DISTINCT cc."userId")::int AS c
        FROM completed_chapters cc
        JOIN "Chapter" c ON c.id = cc.chapter_id
        WHERE c."order" = 1
      ),
      ch3 AS (
        SELECT COUNT(*)::int AS c FROM per_user WHERE done >= 3
      ),
      chall AS (
        SELECT COUNT(*)::int AS c FROM per_user
        WHERE done >= (SELECT c FROM total_chapters)
      )
      SELECT
        (SELECT c FROM total) AS total,
        (SELECT c FROM started) AS started,
        (SELECT c FROM ch1) AS ch1,
        (SELECT c FROM ch3) AS ch3,
        (SELECT c FROM chall) AS chall;
    `);

    const r = rows[0] || { total: 0, started: 0, ch1: 0, ch3: 0, chall: 0 };
    const total = Number(r.total) || 0;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

    return {
      stages: [
        { name: 'Registered', count: total, percent: 100 },
        { name: 'Started Lesson', count: Number(r.started) || 0, percent: pct(Number(r.started) || 0) },
        { name: 'Completed Chapter 1', count: Number(r.ch1) || 0, percent: pct(Number(r.ch1) || 0) },
        { name: 'Completed 3+ Chapters', count: Number(r.ch3) || 0, percent: pct(Number(r.ch3) || 0) },
        { name: 'Completed All Chapters', count: Number(r.chall) || 0, percent: pct(Number(r.chall) || 0) },
      ],
    };
  }

  // 4. Chapter difficulty
  async getChapterDifficulty() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      WITH scores AS (
        SELECT c.id AS chapter_id, qa.score
        FROM "QuizAttempt" qa
        JOIN "Lesson" l ON l.id = qa."lessonId"
        JOIN "Chapter" c ON c.id = l."chapterId"
        UNION ALL
        SELECT ta."chapterId" AS chapter_id, ta.score
        FROM "TestAttempt" ta
      ),
      chapter_scores AS (
        SELECT
          chapter_id,
          ROUND(AVG(score))::int AS avg_score,
          COUNT(*)::int AS attempts,
          ROUND(100.0 * SUM(CASE WHEN score >= 80 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0))::int AS pass_rate
        FROM scores
        GROUP BY chapter_id
      ),
      lessons_per_user AS (
        SELECT l."chapterId" AS chapter_id, lp."userId", COUNT(*)::int AS done
        FROM "LessonProgress" lp
        JOIN "Lesson" l ON l.id = lp."lessonId"
        JOIN "User" u ON u.id = lp."userId"
        WHERE lp.status = 'COMPLETED' AND u.role = 'STUDENT' AND u."isActive" = true
        GROUP BY l."chapterId", lp."userId"
      ),
      avg_lessons AS (
        SELECT chapter_id, ROUND(AVG(done)::numeric, 1)::float AS avg_lessons
        FROM lessons_per_user
        GROUP BY chapter_id
      )
      SELECT
        c."order" AS "order",
        c.title AS title,
        COALESCE(cs.avg_score, 0)::int AS "avgScore",
        COALESCE(cs.attempts, 0)::int AS attempts,
        COALESCE(cs.pass_rate, 0)::int AS "passRate",
        COALESCE(al.avg_lessons, 0)::float AS "avgLessonsCompleted"
      FROM "Chapter" c
      LEFT JOIN chapter_scores cs ON cs.chapter_id = c.id
      LEFT JOIN avg_lessons al ON al.chapter_id = c.id
      ORDER BY c."order" ASC;
    `);

    return {
      chapters: rows.map((r) => ({
        order: Number(r.order),
        title: r.title,
        avgScore: Number(r.avgScore) || 0,
        attempts: Number(r.attempts) || 0,
        passRate: Number(r.passRate) || 0,
        avgLessonsCompleted: Number(r.avgLessonsCompleted) || 0,
      })),
    };
  }

  // 5. Per-question stats (final test questions from Question table)
  async getQuestionStats() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      WITH answer_rows AS (
        SELECT
          (a.answer->>'questionId') AS question_id,
          (a.answer->>'isCorrect')::boolean AS is_correct
        FROM "TestAttempt" ta,
             jsonb_array_elements(ta.answers) AS a(answer)
      ),
      stats AS (
        SELECT
          question_id,
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE is_correct)::int AS correct
        FROM answer_rows
        WHERE question_id IS NOT NULL
        GROUP BY question_id
      )
      SELECT
        q.id AS id,
        q.text AS text,
        c."order" AS "chapterOrder",
        s.total::int AS "totalAttempts",
        s.correct::int AS "correctAttempts",
        ROUND(100.0 * s.correct / NULLIF(s.total, 0))::int AS "correctRate"
      FROM stats s
      JOIN "Question" q ON q.id = s.question_id
      JOIN "Chapter" c ON c.id = q."chapterId"
      ORDER BY "correctRate" ASC NULLS LAST, s.total DESC
      LIMIT 50;
    `);

    const questions = rows.map((r) => {
      const rate = Number(r.correctRate) || 0;
      let difficulty: 'easy' | 'medium' | 'hard';
      if (rate > 80) difficulty = 'easy';
      else if (rate >= 50) difficulty = 'medium';
      else difficulty = 'hard';
      return {
        id: r.id,
        chapterOrder: Number(r.chapterOrder),
        text: r.text,
        totalAttempts: Number(r.totalAttempts) || 0,
        correctAttempts: Number(r.correctAttempts) || 0,
        correctRate: rate,
        difficulty,
      };
    });

    return { questions };
  }
}

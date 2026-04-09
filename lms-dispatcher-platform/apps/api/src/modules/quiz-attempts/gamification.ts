import { LessonType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

// XP per lesson type
export const XP_BY_LESSON_TYPE: Record<string, number> = {
  INTRO: 50,
  THEORY: 100,
  DEMO: 150,
  PRACTICE: 200,
  TEST: 150,
  EXAM: 250,
};

// Level curve: level N requires N*500 XP cumulative
export function levelFromXP(xp: number): number {
  // 0..499 = 1, 500..1499 = 2, 1500..2999 = 3 ...
  // level L starts at L*(L-1)/2 * 500
  let level = 1;
  while ((level * (level + 1) * 500) / 2 <= xp) level++;
  return level;
}

export function xpForLessonType(type: LessonType | string | undefined): number {
  if (!type) return 50;
  return XP_BY_LESSON_TYPE[type] ?? 50;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function daysBetween(a: Date, b: Date) {
  const aUTC = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const bUTC = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((bUTC - aUTC) / (24 * 60 * 60 * 1000));
}

/**
 * Award XP, update streak, evaluate achievements.
 * Returns delta info so callers can return it to clients.
 */
export async function awardXPAndUpdateStreak(
  prisma: PrismaService,
  userId: string,
  xpEarned: number,
): Promise<{
  xpEarned: number;
  totalXP: number;
  level: number;
  streak: number;
  newAchievements: string[];
}> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      totalXP: true,
      streak: true,
      lastStudyDate: true,
      achievements: true,
    },
  });

  const now = new Date();
  let newStreak = user.streak ?? 0;
  if (!user.lastStudyDate) {
    newStreak = 1;
  } else {
    const diff = daysBetween(user.lastStudyDate, now);
    if (diff === 0) {
      // same day — preserve streak
      if (newStreak < 1) newStreak = 1;
    } else if (diff === 1) {
      newStreak = newStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const totalXP = (user.totalXP ?? 0) + xpEarned;
  const level = levelFromXP(totalXP);

  // Evaluate achievements
  const existing = new Set<string>(user.achievements ?? []);
  const newlyEarned: string[] = [];

  const completedLessonsCount = await prisma.lessonProgress.count({
    where: { userId, status: 'COMPLETED' },
  });
  const completedChaptersCount = await prisma.chapterProgress.count({
    where: { userId, status: 'COMPLETED' },
  });
  const passedTestsCount = await prisma.testAttempt.count({
    where: { userId, passed: true },
  });

  const candidates: Array<{ id: string; cond: boolean }> = [
    { id: 'first_lesson', cond: completedLessonsCount >= 1 },
    { id: 'lessons_5', cond: completedLessonsCount >= 5 },
    { id: 'lessons_10', cond: completedLessonsCount >= 10 },
    { id: 'lessons_25', cond: completedLessonsCount >= 25 },
    { id: 'lessons_50', cond: completedLessonsCount >= 50 },
    { id: 'first_chapter', cond: completedChaptersCount >= 1 },
    { id: 'chapters_3', cond: completedChaptersCount >= 3 },
    { id: 'chapters_all', cond: completedChaptersCount >= 9 },
    { id: 'first_test', cond: passedTestsCount >= 1 },
    { id: 'tests_5', cond: passedTestsCount >= 5 },
    { id: 'streak_3', cond: newStreak >= 3 },
    { id: 'streak_7', cond: newStreak >= 7 },
    { id: 'streak_30', cond: newStreak >= 30 },
    { id: 'xp_1000', cond: totalXP >= 1000 },
    { id: 'xp_5000', cond: totalXP >= 5000 },
    { id: 'level_5', cond: level >= 5 },
    { id: 'level_10', cond: level >= 10 },
  ];

  for (const c of candidates) {
    if (c.cond && !existing.has(c.id)) {
      existing.add(c.id);
      newlyEarned.push(c.id);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalXP,
      streak: newStreak,
      lastStudyDate: now,
      achievements: Array.from(existing),
    },
  });

  return {
    xpEarned,
    totalXP,
    level,
    streak: newStreak,
    newAchievements: newlyEarned,
  };
}

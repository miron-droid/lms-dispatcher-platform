import { PrismaClient, UserRole, ContentStatus, LessonType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = (p: string) => bcrypt.hash(p, 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.dev' },
    update: {},
    create: {
      email: 'admin@lms.dev',
      passwordHash: await hash('Admin123!'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@lms.dev' },
    update: {},
    create: {
      email: 'manager@lms.dev',
      passwordHash: await hash('Manager123!'),
      firstName: 'Anna',
      lastName: 'Manager',
      role: UserRole.MANAGER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'student@lms.dev' },
    update: {},
    create: {
      email: 'student@lms.dev',
      passwordHash: await hash('Student123!'),
      firstName: 'Ivan',
      lastName: 'Novikov',
      role: UserRole.STUDENT,
      managerId: manager.id,
    },
  });

  // Course
  const course = await prisma.course.upsert({
    where: { id: 'course-dispatchers-v1' },
    update: {},
    create: {
      id: 'course-dispatchers-v1',
      title: 'Dispatcher Training — US Trucking',
      description: 'From zero to first deal in 21 days.',
      status: ContentStatus.PUBLISHED,
    },
  });

  const chapterTitles = [
    'Introduction to US Trucking',
    'Geography & Time Zones',
    'Equipment Types',
    'Documentation (Rate Con, BOL, POD)',
    'Load Board Platform',
    'Communication with Brokers',
    'Communication with Drivers',
    'Bidding & Deal Closing',
    'Recovery & Problem Solving',
  ];

  for (let i = 0; i < chapterTitles.length; i++) {
    const chapter = await prisma.chapter.upsert({
      where: { id: `chapter-${i + 1}` },
      update: {},
      create: {
        id: `chapter-${i + 1}`,
        courseId: course.id,
        title: chapterTitles[i],
        order: i + 1,
        status: i === 0 ? ContentStatus.PUBLISHED : ContentStatus.PUBLISHED,
        passThreshold: 80,
      },
    });

    const lessonTypes: LessonType[] = [
      LessonType.INTRO,
      LessonType.THEORY,
      LessonType.DEMO,
      LessonType.PRACTICE,
    ];

    for (let j = 0; j < lessonTypes.length; j++) {
      await prisma.lesson.upsert({
        where: { id: `lesson-${i + 1}-${j + 1}` },
        update: {},
        create: {
          id: `lesson-${i + 1}-${j + 1}`,
          chapterId: chapter.id,
          type: lessonTypes[j],
          title: `${lessonTypes[j].charAt(0) + lessonTypes[j].slice(1).toLowerCase()} — ${chapterTitles[i]}`,
          order: j + 1,
          status: ContentStatus.PUBLISHED,
          content: { type: 'text', body: `Sample content for ${lessonTypes[j]} in chapter ${i + 1}.` },
        },
      });
    }

    // Sample question
    const q = await prisma.question.create({
      data: {
        chapterId: chapter.id,
        text: `Sample question for chapter ${i + 1}?`,
        explanation: 'This is the explanation.',
        order: 1,
      },
    });
    await prisma.questionOption.createMany({
      data: [
        { questionId: q.id, text: 'Correct answer', isCorrect: true, order: 1 },
        { questionId: q.id, text: 'Wrong answer A', isCorrect: false, order: 2 },
        { questionId: q.id, text: 'Wrong answer B', isCorrect: false, order: 3 },
        { questionId: q.id, text: 'Wrong answer C', isCorrect: false, order: 4 },
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Seed complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());

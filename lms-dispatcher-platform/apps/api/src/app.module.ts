import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ProgressModule } from './modules/progress/progress.module';
import { TestsModule } from './modules/tests/tests.module';
import { ExamsModule } from './modules/exams/exams.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ChaptersModule,
    LessonsModule,
    ProgressModule,
    TestsModule,
    ExamsModule,
    NotificationsModule,
    AdminModule,
  ],
})
export class AppModule {}

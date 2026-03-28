#!/usr/bin/env python3
"""LMS scaffold generator — run once to produce the full project tree."""
import os

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.lstrip("\n"))

ROOT = "/sessions/optimistic-admiring-tesla/lms"
API  = f"{ROOT}/apps/api"
WEB  = f"{ROOT}/apps/web"

# ─── ROOT ────────────────────────────────────────────────────────────────────

w(f"{ROOT}/package.json", """
{
  "name": "lms-platform",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev:api": "npm run dev --workspace=apps/api",
    "dev:web": "npm run dev --workspace=apps/web",
    "db:migrate": "npm run db:migrate --workspace=apps/api",
    "db:seed": "npm run db:seed --workspace=apps/api"
  }
}
""")

w(f"{ROOT}/.env.example", """
# Copy to apps/api/.env and apps/web/.env.local

# API
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lms_db
JWT_SECRET=change_me_to_random_64_char_string
JWT_EXPIRES_IN=7d
PORT=3001

# Web
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Email (Resend or SMTP)
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=

# Web Push (generate with: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@yourdomain.com
""")

w(f"{ROOT}/docker-compose.yml", """
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: lms_db
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data:
""")

# ─── API: package.json ────────────────────────────────────────────────────────

w(f"{API}/package.json", """
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "node dist/main",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "generate": "prisma generate"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/event-emitter": "^2.0.4",
    "@prisma/client": "^5.9.0",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "web-push": "^3.6.7",
    "nodemailer": "^6.9.9"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.5",
    "@types/nodemailer": "^6.4.14",
    "@types/passport-jwt": "^4.0.1",
    "@types/web-push": "^3.6.3",
    "prisma": "^5.9.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
""")

w(f"{API}/tsconfig.json", """
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": { "@/*": ["src/*"] },
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true
  }
}
""")

w(f"{API}/nest-cli.json", """
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": { "deleteOutDir": true }
}
""")

# ─── PRISMA SCHEMA ────────────────────────────────────────────────────────────

w(f"{API}/prisma/schema.prisma", """
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Enums ─────────────────────────────────────────────────────────────────────

enum UserRole {
  STUDENT
  MANAGER
  ADMIN
}

enum ContentStatus {
  DRAFT
  PUBLISHED
}

enum LessonType {
  INTRO
  THEORY
  DEMO
  PRACTICE
  TEST
  EXAM
}

enum ProgressStatus {
  LOCKED
  IN_PROGRESS
  COMPLETED
}

enum ExamDecision {
  PASS
  RETRY
  DISBAND
}

enum ExamStatus {
  REQUESTED
  SCHEDULED
  COMPLETED
  CANCELLED
}

// ── User ──────────────────────────────────────────────────────────────────────

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  role         UserRole  @default(STUDENT)
  isActive     Boolean   @default(true)
  lastActiveAt DateTime?

  managerId String?
  manager   User?   @relation("ManagerStudents", fields: [managerId], references: [id])
  students  User[]  @relation("ManagerStudents")

  lessonProgress   LessonProgress[]
  chapterProgress  ChapterProgress[]
  testAttempts     TestAttempt[]
  examRequests     ExamRequest[]     @relation("StudentExams")
  examReviews      ExamRequest[]     @relation("ManagerExams")
  pushSubscriptions PushSubscription[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([role])
  @@index([managerId])
}

// ── Course & structure ────────────────────────────────────────────────────────

model Course {
  id          String        @id @default(uuid())
  title       String
  description String?
  status      ContentStatus @default(DRAFT)
  order       Int           @default(0)
  chapters    Chapter[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Chapter {
  id            String        @id @default(uuid())
  courseId      String
  course        Course        @relation(fields: [courseId], references: [id])
  title         String
  description   String?
  order         Int
  status        ContentStatus @default(DRAFT)
  passThreshold Int           @default(80)

  lessons         Lesson[]
  questions       Question[]
  chapterProgress ChapterProgress[]
  examRequests    ExamRequest[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId, order])
}

model Lesson {
  id        String        @id @default(uuid())
  chapterId String
  chapter   Chapter       @relation(fields: [chapterId], references: [id])
  type      LessonType
  title     String
  order     Int
  status    ContentStatus @default(DRAFT)

  // Flexible content blob per lesson type:
  // TEXT   → { type:"text",     body: string }
  // VIDEO  → { type:"video",    hlsUrl: string, posterUrl?: string }
  // DIALOGUE → { type:"dialogue", messages:[{role:"broker"|"dispatcher",text}] }
  // CASE   → { type:"case",     scenario:string, options:[{label,explanation}], correctIndex:number }
  content Json?

  lessonProgress LessonProgress[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([chapterId, order])
}

// ── Questions (chapter test bank) ─────────────────────────────────────────────

model Question {
  id          String   @id @default(uuid())
  chapterId   String
  chapter     Chapter  @relation(fields: [chapterId], references: [id])
  text        String
  explanation String?
  isMultiple  Boolean  @default(false)
  order       Int      @default(0)
  options     QuestionOption[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([chapterId])
}

model QuestionOption {
  id         String   @id @default(uuid())
  questionId String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  text       String
  isCorrect  Boolean  @default(false)
  order      Int      @default(0)
}

// ── Progress ──────────────────────────────────────────────────────────────────

model LessonProgress {
  id          String         @id @default(uuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  lessonId    String
  lesson      Lesson         @relation(fields: [lessonId], references: [id])
  status      ProgressStatus @default(LOCKED)
  completedAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, lessonId])
  @@index([userId])
}

model ChapterProgress {
  id          String         @id @default(uuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  chapterId   String
  chapter     Chapter        @relation(fields: [chapterId], references: [id])
  status      ProgressStatus @default(LOCKED)
  testPassed  Boolean        @default(false)
  examPassed  Boolean        @default(false)
  completedAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, chapterId])
  @@index([userId])
}

// ── Tests ─────────────────────────────────────────────────────────────────────

model TestAttempt {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  chapterId   String
  score       Int
  passed      Boolean
  // [{questionId, selectedOptionIds:string[], isCorrect}]
  answers     Json
  completedAt DateTime @default(now())

  @@index([userId, chapterId])
}

// ── Exams ─────────────────────────────────────────────────────────────────────

model ExamRequest {
  id          String       @id @default(uuid())
  studentId   String
  student     User         @relation("StudentExams", fields: [studentId], references: [id])
  managerId   String?
  manager     User?        @relation("ManagerExams", fields: [managerId], references: [id])
  chapterId   String
  chapter     Chapter      @relation(fields: [chapterId], references: [id])
  status      ExamStatus   @default(REQUESTED)
  scheduledAt DateTime?
  decision    ExamDecision?
  comment     String?
  completedAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studentId])
  @@index([managerId, status])
}

// ── Push notifications ────────────────────────────────────────────────────────

model PushSubscription {
  id       String @id @default(uuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id])
  endpoint String
  p256dh   String
  auth     String

  createdAt DateTime @default(now())

  @@unique([userId, endpoint])
}
""")

# ─── PRISMA SEED ─────────────────────────────────────────────────────────────

w(f"{API}/prisma/seed.ts", """
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
""")

# ─── API: main.ts ─────────────────────────────────────────────────────────────

w(f"{API}/src/main.ts", """
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api/v1`);
}

bootstrap();
""")

# ─── API: app.module.ts ───────────────────────────────────────────────────────

w(f"{API}/src/app.module.ts", """
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
""")

# ─── Prisma service ───────────────────────────────────────────────────────────

w(f"{API}/src/prisma/prisma.service.ts", """
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
""")

w(f"{API}/src/prisma/prisma.module.ts", """
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
""")

# ─── Common ───────────────────────────────────────────────────────────────────

w(f"{API}/src/common/types/authenticated-request.type.ts", """
import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
""")

w(f"{API}/src/common/decorators/current-user.decorator.ts", """
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/authenticated-request.type';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtPayload =>
    ctx.switchToHttp().getRequest().user,
);
""")

w(f"{API}/src/common/decorators/public.decorator.ts", """
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
""")

w(f"{API}/src/common/decorators/roles.decorator.ts", """
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
""")

w(f"{API}/src/common/guards/jwt-auth.guard.ts", """
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
}
""")

w(f"{API}/src/common/guards/roles.guard.ts", """
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!required.includes(user?.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
""")

w(f"{API}/src/common/filters/http-exception.filter.ts", """
import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    response.status(status).json({
      success: false,
      statusCode: status,
      message: typeof body === 'string' ? body : (body as any).message,
      errors: typeof body === 'object' ? (body as any).errors ?? null : null,
      timestamp: new Date().toISOString(),
    });
  }
}
""")

w(f"{API}/src/common/filters/prisma-exception.filter.ts", """
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { statusCode, message } = this.map(exception);
    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private map(e: Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        return { statusCode: HttpStatus.CONFLICT, message: 'Resource already exists' };
      case 'P2025':
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Resource not found' };
      default:
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Database error' };
    }
  }
}
""")

w(f"{API}/src/common/interceptors/response-transform.interceptor.ts", """
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data ?? null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
""")

# ─── AUTH MODULE ─────────────────────────────────────────────────────────────

w(f"{API}/src/modules/auth/auth.module.ts", """
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES_IN', '7d') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
""")

w(f"{API}/src/modules/auth/strategies/jwt.strategy.ts", """
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtPayload } from '../../../common/types/authenticated-request.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return { sub: user.id, email: user.email, role: user.role };
  }
}
""")

w(f"{API}/src/modules/auth/dto/login.dto.ts", """
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
""")

w(f"{API}/src/modules/auth/auth.service.ts", """
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwt.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, lastActiveAt: true,
      },
    });
  }
}
""")

w(f"{API}/src/modules/auth/auth.controller.ts", """
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.auth.me(user.sub);
  }
}
""")

# ─── USERS MODULE ─────────────────────────────────────────────────────────────

w(f"{API}/src/modules/users/users.module.ts", """
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
""")

w(f"{API}/src/modules/users/dto/create-user.dto.ts", """
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsUUID()
  @IsOptional()
  managerId?: string;
}
""")

w(f"{API}/src/modules/users/users.service.ts", """
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { password: _, ...rest } = dto;

    return this.prisma.user.create({
      data: { ...rest, passwordHash },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, managerId: true },
    });
  }

  findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: { isActive: true, ...(role ? { role } : {}) },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, lastActiveAt: true,
        manager: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, isActive: true, lastActiveAt: true,
      },
    });
  }

  deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });
  }

  getStudentsForManager(managerId: string) {
    return this.prisma.user.findMany({
      where: { managerId, isActive: true, role: UserRole.STUDENT },
      select: {
        id: true, email: true, firstName: true, lastName: true, lastActiveAt: true,
        chapterProgress: {
          select: { chapterId: true, status: true, testPassed: true, examPassed: true },
        },
      },
    });
  }
}
""")

w(f"{API}/src/modules/users/users.controller.ts", """
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query('role') role?: UserRole) {
    return this.users.findAll(role);
  }

  @Get('my-students')
  @Roles(UserRole.MANAGER)
  myStudents(@CurrentUser() user: JwtPayload) {
    return this.users.getStudentsForManager(user.sub);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deactivate(@Param('id') id: string) {
    return this.users.deactivate(id);
  }
}
""")

# ─── COURSES MODULE ───────────────────────────────────────────────────────────

w(f"{API}/src/modules/courses/courses.module.ts", """
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
""")

w(f"{API}/src/modules/courses/courses.service.ts", """
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findPublished() {
    return this.prisma.course.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        chapters: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, order: true, passThreshold: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { chapters: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }
}
""")

w(f"{API}/src/modules/courses/courses.controller.ts", """
import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get()
  findAll() {
    return this.courses.findPublished();
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.courses.findAll();
  }
}
""")

# ─── CHAPTERS MODULE ──────────────────────────────────────────────────────────

w(f"{API}/src/modules/chapters/chapters.module.ts", """
import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
""")

w(f"{API}/src/modules/chapters/chapters.service.ts", """
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, ProgressStatus } from '@prisma/client';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  async findOne(chapterId: string, userId: string) {
    const progress = await this.prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    });

    if (progress?.status === ProgressStatus.LOCKED) {
      throw new ForbiddenException('Complete the previous chapter first');
    }

    const chapter = await this.prisma.chapter.findUniqueOrThrow({
      where: { id: chapterId, status: ContentStatus.PUBLISHED },
      include: {
        lessons: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          include: {
            lessonProgress: { where: { userId }, select: { status: true } },
          },
        },
        _count: { select: { questions: true } },
      },
    });

    return { chapter, progress };
  }
}
""")

w(f"{API}/src/modules/chapters/chapters.controller.ts", """
import { Controller, Get, Param } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('chapters')
export class ChaptersController {
  constructor(private chapters: ChaptersService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.chapters.findOne(id, user.sub);
  }
}
""")

# ─── LESSONS MODULE ───────────────────────────────────────────────────────────

w(f"{API}/src/modules/lessons/lessons.module.ts", """
import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
""")

w(f"{API}/src/modules/lessons/lessons.service.ts", """
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressStatus, ContentStatus } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId, status: ContentStatus.PUBLISHED },
      include: { chapter: { select: { id: true, title: true } } },
    });

    const progress = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    return { lesson, progress };
  }

  async complete(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            lessons: { where: { status: ContentStatus.PUBLISHED }, orderBy: { order: 'asc' } },
          },
        },
      },
    });

    // Mark current lesson complete
    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { status: ProgressStatus.COMPLETED, completedAt: new Date() },
      create: {
        userId, lessonId,
        status: ProgressStatus.COMPLETED, completedAt: new Date(),
      },
    });

    // Unlock next lesson in same chapter
    const lessons = lesson.chapter.lessons;
    const currentIdx = lessons.findIndex((l) => l.id === lessonId);
    const next = lessons[currentIdx + 1];

    if (next) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: next.id } },
        update: {},
        create: { userId, lessonId: next.id, status: ProgressStatus.IN_PROGRESS },
      });
    }

    // Check if all lessons in chapter are done — update chapter progress
    const allProgress = await this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    });
    const allDone = lessons.every((l) =>
      allProgress.find((p) => p.lessonId === l.id)?.status === ProgressStatus.COMPLETED,
    );

    if (allDone) {
      await this.prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId: lesson.chapterId } },
        update: { status: ProgressStatus.IN_PROGRESS },
        create: { userId, chapterId: lesson.chapterId, status: ProgressStatus.IN_PROGRESS },
      });
    }

    return { completed: true, nextLessonId: next?.id ?? null };
  }
}
""")

w(f"{API}/src/modules/lessons/lessons.controller.ts", """
import { Controller, Get, Param, Post } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('lessons')
export class LessonsController {
  constructor(private lessons: LessonsService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessons.findOne(id, user.sub);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessons.complete(id, user.sub);
  }
}
""")

# ─── PROGRESS MODULE ──────────────────────────────────────────────────────────

w(f"{API}/src/modules/progress/progress.module.ts", """
import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
""")

w(f"{API}/src/modules/progress/progress.service.ts", """
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        chapters: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { order: 'asc' },
          include: {
            chapterProgress: { where: { userId } },
            lessons: {
              where: { status: ContentStatus.PUBLISHED },
              include: { lessonProgress: { where: { userId } } },
            },
          },
        },
      },
    });

    const chapters = course.chapters.map((ch) => {
      const cp = ch.chapterProgress[0];
      const totalLessons = ch.lessons.length;
      const completedLessons = ch.lessons.filter(
        (l) => l.lessonProgress[0]?.status === ProgressStatus.COMPLETED,
      ).length;
      return {
        id: ch.id,
        title: ch.title,
        order: ch.order,
        status: cp?.status ?? ProgressStatus.LOCKED,
        testPassed: cp?.testPassed ?? false,
        examPassed: cp?.examPassed ?? false,
        lessonsTotal: totalLessons,
        lessonsCompleted: completedLessons,
      };
    });

    const totalChapters = chapters.length;
    const passedChapters = chapters.filter((c) => c.examPassed).length;

    return {
      courseId,
      overallPercent: totalChapters > 0 ? Math.round((passedChapters / totalChapters) * 100) : 0,
      chapters,
    };
  }

  async initializeCourse(userId: string, courseId: string) {
    const firstChapter = await this.prisma.chapter.findFirst({
      where: { courseId, status: ContentStatus.PUBLISHED },
      orderBy: { order: 'asc' },
      include: {
        lessons: { where: { status: ContentStatus.PUBLISHED }, orderBy: { order: 'asc' } },
      },
    });
    if (!firstChapter) return;

    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: firstChapter.id } },
      update: {},
      create: { userId, chapterId: firstChapter.id, status: ProgressStatus.IN_PROGRESS },
    });

    const firstLesson = firstChapter.lessons[0];
    if (firstLesson) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
        update: {},
        create: { userId, lessonId: firstLesson.id, status: ProgressStatus.IN_PROGRESS },
      });
    }
  }
}
""")

w(f"{API}/src/modules/progress/progress.controller.ts", """
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('progress')
export class ProgressController {
  constructor(private progress: ProgressService) {}

  @Get('courses/:courseId')
  getCourseProgress(@Param('courseId') courseId: string, @CurrentUser() user: JwtPayload) {
    return this.progress.getCourseProgress(user.sub, courseId);
  }

  @Post('courses/:courseId/initialize')
  initialize(@Param('courseId') courseId: string, @CurrentUser() user: JwtPayload) {
    return this.progress.initializeCourse(user.sub, courseId);
  }
}
""")

# ─── TESTS MODULE ─────────────────────────────────────────────────────────────

w(f"{API}/src/modules/tests/tests.module.ts", """
import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';

@Module({
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
""")

w(f"{API}/src/modules/tests/dto/submit-test.dto.ts", """
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsUUID()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  selectedOptionIds: string[];
}

export class SubmitTestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
""")

w(f"{API}/src/modules/tests/tests.service.ts", """
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { ProgressStatus } from '@prisma/client';

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
    }

    return { score, passed, threshold: chapter.passThreshold, results };
  }

  getAttempts(chapterId: string, userId: string) {
    return this.prisma.testAttempt.findMany({
      where: { chapterId, userId },
      orderBy: { completedAt: 'desc' },
      select: { id: true, score: true, passed: true, completedAt: true },
    });
  }
}
""")

w(f"{API}/src/modules/tests/tests.controller.ts", """
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('tests')
export class TestsController {
  constructor(private tests: TestsService) {}

  @Get('chapters/:chapterId/questions')
  getQuestions(@Param('chapterId') chapterId: string) {
    return this.tests.getQuestions(chapterId);
  }

  @Post('chapters/:chapterId/submit')
  submit(
    @Param('chapterId') chapterId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: SubmitTestDto,
  ) {
    return this.tests.submit(chapterId, user.sub, dto);
  }

  @Get('chapters/:chapterId/attempts')
  attempts(@Param('chapterId') chapterId: string, @CurrentUser() user: JwtPayload) {
    return this.tests.getAttempts(chapterId, user.sub);
  }
}
""")

# ─── EXAMS MODULE ─────────────────────────────────────────────────────────────

w(f"{API}/src/modules/exams/exams.module.ts", """
import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
""")

w(f"{API}/src/modules/exams/dto/request-exam.dto.ts", """
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class RequestExamDto {
  @IsUUID()
  chapterId: string;

  @IsDateString()
  @IsOptional()
  preferredAt?: string;
}
""")

w(f"{API}/src/modules/exams/dto/review-exam.dto.ts", """
import { IsEnum, IsString, MinLength } from 'class-validator';
import { ExamDecision } from '@prisma/client';

export class ReviewExamDto {
  @IsEnum(ExamDecision)
  decision: ExamDecision;

  @IsString()
  @MinLength(10, { message: 'Comment must be at least 10 characters' })
  comment: string;
}
""")

w(f"{API}/src/modules/exams/exams.service.ts", """
import {
  Injectable, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestExamDto } from './dto/request-exam.dto';
import { ReviewExamDto } from './dto/review-exam.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamDecision, ExamStatus, ProgressStatus, UserRole } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async request(studentId: string, dto: RequestExamDto) {
    // Student must have passed the test first
    const cp = await this.prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId: studentId, chapterId: dto.chapterId } },
    });
    if (!cp?.testPassed) {
      throw new BadRequestException('You must pass the chapter test before requesting an exam');
    }

    // No pending exam for this chapter
    const existing = await this.prisma.examRequest.findFirst({
      where: {
        studentId,
        chapterId: dto.chapterId,
        status: { in: [ExamStatus.REQUESTED, ExamStatus.SCHEDULED] },
      },
    });
    if (existing) {
      throw new BadRequestException('You already have a pending exam for this chapter');
    }

    // Find student's manager
    const student = await this.prisma.user.findUniqueOrThrow({
      where: { id: studentId },
      select: { managerId: true },
    });

    const exam = await this.prisma.examRequest.create({
      data: {
        studentId,
        managerId: student.managerId ?? undefined,
        chapterId: dto.chapterId,
        scheduledAt: dto.preferredAt ? new Date(dto.preferredAt) : undefined,
      },
    });

    this.events.emit('exam.requested', { examId: exam.id, studentId, managerId: student.managerId });

    return exam;
  }

  async review(examId: string, managerId: string, dto: ReviewExamDto) {
    const exam = await this.prisma.examRequest.findUniqueOrThrow({ where: { id: examId } });

    if (exam.managerId && exam.managerId !== managerId) {
      throw new ForbiddenException('This exam is not assigned to you');
    }
    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('Exam already completed');
    }

    const updated = await this.prisma.examRequest.update({
      where: { id: examId },
      data: {
        decision: dto.decision,
        comment: dto.comment,
        status: ExamStatus.COMPLETED,
        completedAt: new Date(),
        managerId,
      },
    });

    if (dto.decision === ExamDecision.PASS) {
      await this.prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId: exam.studentId, chapterId: exam.chapterId } },
        update: { examPassed: true, status: ProgressStatus.COMPLETED, completedAt: new Date() },
        create: {
          userId: exam.studentId,
          chapterId: exam.chapterId,
          examPassed: true,
          testPassed: true,
          status: ProgressStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      await this.unlockNextChapter(exam.studentId, exam.chapterId);
    }

    if (dto.decision === ExamDecision.DISBAND) {
      await this.prisma.user.update({
        where: { id: exam.studentId },
        data: { isActive: false },
      });
    }

    this.events.emit('exam.reviewed', {
      examId, studentId: exam.studentId, decision: dto.decision,
    });

    return updated;
  }

  private async unlockNextChapter(userId: string, currentChapterId: string) {
    const current = await this.prisma.chapter.findUniqueOrThrow({
      where: { id: currentChapterId },
      select: { order: true, courseId: true },
    });
    const next = await this.prisma.chapter.findFirst({
      where: { courseId: current.courseId, order: current.order + 1 },
      include: {
        lessons: { orderBy: { order: 'asc' }, take: 1 },
      },
    });
    if (!next) return;

    await this.prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: next.id } },
      update: { status: ProgressStatus.IN_PROGRESS },
      create: { userId, chapterId: next.id, status: ProgressStatus.IN_PROGRESS },
    });

    if (next.lessons[0]) {
      await this.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: next.lessons[0].id } },
        update: {},
        create: { userId, lessonId: next.lessons[0].id, status: ProgressStatus.IN_PROGRESS },
      });
    }
  }

  getPending(managerId: string) {
    return this.prisma.examRequest.findMany({
      where: { managerId, status: { in: [ExamStatus.REQUESTED, ExamStatus.SCHEDULED] } },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true } },
        chapter: { select: { id: true, title: true, order: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  getMyExams(studentId: string) {
    return this.prisma.examRequest.findMany({
      where: { studentId },
      include: { chapter: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
""")

w(f"{API}/src/modules/exams/exams.controller.ts", """
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { RequestExamDto } from './dto/request-exam.dto';
import { ReviewExamDto } from './dto/review-exam.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('exams')
export class ExamsController {
  constructor(private exams: ExamsService) {}

  @Post('request')
  @Roles(UserRole.STUDENT)
  request(@CurrentUser() user: JwtPayload, @Body() dto: RequestExamDto) {
    return this.exams.request(user.sub, dto);
  }

  @Get('my')
  @Roles(UserRole.STUDENT)
  myExams(@CurrentUser() user: JwtPayload) {
    return this.exams.getMyExams(user.sub);
  }

  @Get('pending')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  pending(@CurrentUser() user: JwtPayload) {
    return this.exams.getPending(user.sub);
  }

  @Post(':id/review')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  review(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ReviewExamDto,
  ) {
    return this.exams.review(id, user.sub, dto);
  }
}
""")

# ─── NOTIFICATIONS MODULE ─────────────────────────────────────────────────────

w(f"{API}/src/modules/notifications/notifications.module.ts", """
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ExamEventListener } from './listeners/exam-event.listener';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, ExamEventListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
""")

w(f"{API}/src/modules/notifications/notifications.service.ts", """
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService, private cfg: ConfigService) {
    const vapidPublic = cfg.get('VAPID_PUBLIC_KEY');
    const vapidPrivate = cfg.get('VAPID_PRIVATE_KEY');
    const vapidEmail = cfg.get('VAPID_EMAIL', 'mailto:admin@example.com');
    if (vapidPublic && vapidPrivate) {
      webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);
    }
  }

  async subscribe(userId: string, sub: { endpoint: string; p256dh: string; auth: string }) {
    return this.prisma.pushSubscription.upsert({
      where: { userId_endpoint: { userId, endpoint: sub.endpoint } },
      update: { p256dh: sub.p256dh, auth: sub.auth },
      create: { userId, ...sub },
    });
  }

  async sendPush(userId: string, payload: { title: string; body: string; url?: string }) {
    const subs = await this.prisma.pushSubscription.findMany({ where: { userId } });
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
      } catch (err) {
        this.logger.warn(`Push failed for ${sub.endpoint}: ${err.message}`);
        if ((err as any).statusCode === 410) {
          await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    }
  }
}
""")

w(f"{API}/src/modules/notifications/listeners/exam-event.listener.ts", """
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ExamEventListener {
  constructor(
    private notifications: NotificationsService,
    private prisma: PrismaService,
  ) {}

  @OnEvent('exam.requested')
  async onExamRequested(payload: { examId: string; studentId: string; managerId?: string }) {
    const student = await this.prisma.user.findUnique({
      where: { id: payload.studentId },
      select: { firstName: true, lastName: true },
    });

    if (payload.managerId) {
      await this.notifications.sendPush(payload.managerId, {
        title: 'New exam request',
        body: `${student?.firstName} ${student?.lastName} requested an exam`,
        url: '/manager/exams',
      });
    }
  }

  @OnEvent('exam.reviewed')
  async onExamReviewed(payload: { examId: string; studentId: string; decision: string }) {
    await this.notifications.sendPush(payload.studentId, {
      title: `Exam result: ${payload.decision}`,
      body: payload.decision === 'PASS'
        ? 'Congratulations! You passed. Next chapter is unlocked.'
        : payload.decision === 'RETRY'
        ? 'Review the material and try again.'
        : 'Please contact your manager.',
      url: '/progress',
    });
  }
}
""")

w(f"{API}/src/modules/notifications/notifications.controller.ts", """
import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { IsString } from 'class-validator';

class PushSubscribeDto {
  @IsString() endpoint: string;
  @IsString() p256dh: string;
  @IsString() auth: string;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Post('push/subscribe')
  subscribe(@CurrentUser() user: JwtPayload, @Body() dto: PushSubscribeDto) {
    return this.notifications.subscribe(user.sub, dto);
  }
}
""")

# ─── ADMIN MODULE ─────────────────────────────────────────────────────────────

w(f"{API}/src/modules/admin/admin.module.ts", """
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
""")

w(f"{API}/src/modules/admin/dto/upsert-chapter.dto.ts", """
import {
  IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min,
} from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class UpsertChapterDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @IsInt()
  @Min(50)
  @Max(100)
  @IsOptional()
  passThreshold?: number;
}
""")

w(f"{API}/src/modules/admin/dto/upsert-lesson.dto.ts", """
import { IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ContentStatus, LessonType } from '@prisma/client';

export class UpsertLessonDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(LessonType)
  type: LessonType;

  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}
""")

w(f"{API}/src/modules/admin/admin.service.ts", """
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
""")

w(f"{API}/src/modules/admin/admin.controller.ts", """
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpsertChapterDto } from './dto/upsert-chapter.dto';
import { UpsertLessonDto } from './dto/upsert-lesson.dto';
import { UserRole } from '@prisma/client';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  dashboard() { return this.admin.getDashboard(); }

  @Get('analytics/students')
  studentAnalytics() { return this.admin.getStudentAnalytics(); }

  @Post('courses/:courseId/chapters')
  upsertChapter(@Param('courseId') courseId: string, @Body() dto: UpsertChapterDto) {
    return this.admin.upsertChapter(courseId, dto);
  }

  @Post('chapters/:chapterId/lessons')
  upsertLesson(@Param('chapterId') chapterId: string, @Body() dto: UpsertLessonDto) {
    return this.admin.upsertLesson(chapterId, dto);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id') id: string) { return this.admin.deleteLesson(id); }

  @Get('chapters/:chapterId/questions')
  getQuestions(@Param('chapterId') chapterId: string) {
    return this.admin.getQuestions(chapterId);
  }

  @Post('chapters/:chapterId/questions')
  upsertQuestion(@Param('chapterId') chapterId: string, @Body() data: any) {
    return this.admin.upsertQuestion(chapterId, data);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string) { return this.admin.deleteQuestion(id); }
}
""")

print("✅ Backend files written")

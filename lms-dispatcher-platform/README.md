# LMS Dispatcher Training Platform

Mobile-first PWA for training beginner freight dispatchers. NestJS API + Next.js frontend.

## Stack

| Layer | Tech |
|---|---|
| API | NestJS 10, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Frontend | Next.js 14 App Router, Tailwind CSS, shadcn/ui |
| Auth | JWT (passport-jwt), bcrypt |
| Push | Web Push API (VAPID) |
| PWA | next-pwa, Service Worker |

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- pnpm (`npm i -g pnpm`)

## Quick Start

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Configure environment

```bash
cp .env.example apps/api/.env
# Edit apps/api/.env — set DATABASE_URL, JWT_SECRET, VAPID keys
```

Generate VAPID keys:
```bash
cd apps/api && npx web-push generate-vapid-keys
```

### 3. Install dependencies

```bash
# From repo root
cd apps/api && npm install
cd ../web && npm install
```

### 4. Set up the database

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma db seed
```

Seed creates three accounts:
| Email | Password | Role |
|---|---|---|
| admin@lms.dev | Admin1234! | ADMIN |
| manager@lms.dev | Manager1234! | MANAGER |
| student@lms.dev | Student1234! | STUDENT |

### 5. Run in development

Terminal 1 — API (port 3001):
```bash
cd apps/api && npm run start:dev
```

Terminal 2 — Web (port 3000):
```bash
cd apps/web && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lms/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Single source of truth for DB schema
│   │   │   └── seed.ts         # Initial data + 9 chapters, 36 lessons
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/       # JWT login, /auth/me
│   │       │   ├── courses/    # Course listing
│   │       │   ├── chapters/   # Chapter detail + questions
│   │       │   ├── lessons/    # Lesson detail + completion
│   │       │   ├── progress/   # Course progress, initialization
│   │       │   ├── tests/      # Test submit + attempt history
│   │       │   ├── exams/      # Exam request + manager review
│   │       │   ├── notifications/ # Web Push subscriptions + VAPID send
│   │       │   ├── users/      # User CRUD (admin/manager)
│   │       │   └── admin/      # Dashboard, content management
│   │       └── common/
│   │           ├── guards/     # JwtAuthGuard, RolesGuard
│   │           ├── filters/    # HttpException, PrismaException
│   │           ├── interceptors/ # ResponseTransform (wraps all responses)
│   │           └── decorators/ # @Public(), @Roles(), @CurrentUser()
│   └── web/                    # Next.js 14 frontend
│       └── src/
│           ├── app/
│           │   ├── (auth)/     # Login page
│           │   ├── (student)/  # Learn, Progress, Exams, Profile
│           │   └── (manager)/  # Manager exam review queue
│           ├── components/
│           │   ├── domain/     # ChapterCard, LessonContent, ProgressRing
│           │   └── layout/     # BottomNav
│           └── lib/
│               ├── api/        # apiFetch client + route helpers
│               └── stores/     # Zustand auth store
└── docker-compose.yml
```

## API Reference

All responses wrapped as `{ success: true, data: ..., timestamp: "..." }`.

Auth header: `Authorization: Bearer <token>`

### Auth
| Method | Path | Description |
|---|---|---|
| POST | /api/v1/auth/login | Login → JWT token |
| GET | /api/v1/auth/me | Current user |

### Student flows
| Method | Path | Description |
|---|---|---|
| GET | /api/v1/courses | List courses |
| POST | /api/v1/progress/initialize | Unlock first chapter+lesson |
| GET | /api/v1/progress/course | Full progress with % |
| GET | /api/v1/chapters/:id | Chapter + lessons |
| GET | /api/v1/lessons/:id | Lesson detail |
| POST | /api/v1/lessons/:id/complete | Mark done, unlock next |
| GET | /api/v1/tests/:chapterId/questions | Shuffled test questions |
| POST | /api/v1/tests/:chapterId/submit | Submit answers → score |
| POST | /api/v1/exams/request | Request oral exam |
| GET | /api/v1/exams/my | Student's exam history |

### Manager flows
| Method | Path | Description |
|---|---|---|
| GET | /api/v1/exams/pending | Pending exams for my students |
| POST | /api/v1/exams/:id/review | PASS / RETRY / DISBAND + comment |

### Push notifications
| Method | Path | Description |
|---|---|---|
| POST | /api/v1/notifications/subscribe | Save push subscription |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | /api/v1/admin/dashboard | Stats: users, avg score, pending exams |
| POST | /api/v1/admin/chapters | Upsert chapter |
| POST | /api/v1/admin/chapters/:id/lessons | Upsert lesson |
| DELETE | /api/v1/admin/lessons/:id | Delete lesson |
| POST | /api/v1/admin/chapters/:id/questions | Upsert question |
| GET | /api/v1/admin/students/:id/analytics | Student analytics |

## Roles & Access

| Role | Can do |
|---|---|
| STUDENT | Own progress, lessons, tests, exam requests |
| MANAGER | Review exams for assigned students, see their progress |
| ADMIN | Everything + content management, user management, dashboard |

## Learning Flow

```
Course
 └── Chapter (locked until previous chapter exam PASS)
      ├── Lesson 1 (unlocked)
      ├── Lesson 2 (locked until Lesson 1 complete)
      ├── ...
      ├── Chapter Test (unlock after all lessons complete, need ≥80%)
      └── Oral Exam Request → Manager reviews → PASS/RETRY/DISBAND
```

On **DISBAND**: student account is deactivated. Manager must re-activate manually.

## Push Notifications

Events that trigger push:
- `exam.requested` → Manager gets push: "Student X requests exam review"
- `exam.reviewed` → Student gets push: PASS / RETRY / DISBAND result

Requires VAPID keys in `.env`. On iOS, requires iOS 16.4+ with PWA installed to home screen.

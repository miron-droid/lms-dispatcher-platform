export type Lang = 'en' | 'ru';

export const translations = {
  en: {
    // Navigation
    nav_course: 'Course',
    nav_progress: 'Progress',
    nav_exams: 'Exams',
    nav_profile: 'Profile',
    nav_glossary: 'Glossary',

    // Auth
    auth_title: 'Dispatcher Training',
    auth_subtitle: 'Sign in to continue',
    auth_email: 'Email',
    auth_password: 'Password',
    auth_sign_in: 'Sign in',
    auth_signing_in: 'Signing in…',
    auth_login_failed: 'Login failed',

    // Learn page
    learn_course_title: 'US Trucking Course',
    learn_hello: 'Hello',

    // Chapter card
    chapter_prefix: 'Ch.',
    chapter_exam_pending: 'Exam pending',
    chapter_complete: 'Complete',

    // Lesson page
    lesson_mark_complete: 'Mark as Complete →',
    lesson_saving: 'Saving…',
    lesson_done: 'Done! Moving on…',
    lesson_back_to_chapter: 'Back to Chapter',

    // Lesson types
    lesson_type_INTRO: 'Intro',
    lesson_type_THEORY: 'Theory',
    lesson_type_DEMO: 'Demo',
    lesson_type_PRACTICE: 'Practice',
    lesson_type_TEST: 'Test',
    lesson_type_EXAM: 'Exam',

    // Quiz
    quiz_title: 'Quick Check',
    quiz_out_of: 'out of',
    quiz_correct: 'correct',
    quiz_goal_achieved: 'Goal achieved ✓',
    quiz_proceed: 'You can proceed to the next lesson.',
    quiz_goal_not_achieved: 'Goal not achieved',
    quiz_review_material: 'Review the material above before continuing.',
    quiz_try_again: 'Try again',

    // Mandatory quiz flow
    lesson_status_reading: '📖 Reading the lesson',
    lesson_status_quiz_pending: '❓ Quiz pending',
    lesson_status_quiz_failed: '⚠️ Quiz failed — try again',
    lesson_status_quiz_passed: '✅ Quiz passed — complete the lesson',
    lesson_complete_the_quiz: 'Complete the quiz below to finish this lesson',
    lesson_quiz_required_tooltip: 'Pass the quiz to continue',
    lesson_step_read: 'Read content',
    lesson_step_quiz: 'Complete quiz',
    lesson_step_complete: 'Mark complete',
    quiz_success_banner: 'Great job! You can now complete the lesson.',
    quiz_locked_hint: 'The lesson cannot be marked complete until the quiz is passed.',
    chapter_quizzes_passed: 'quizzes passed',
    chapter_test_locked: 'Pass all lesson quizzes to unlock the chapter test',

    // Chapter unlock celebration
    celebrate_badge: 'Chapter unlocked',
    celebrate_title: 'Chapter {n} unlocked!',
    celebrate_body: 'Keep the momentum going — start the next chapter now.',
    celebrate_next_chapter: 'Start next chapter',
    celebrate_stay: 'Stay here',

    // Empty state card
    empty_badge: 'Let\u2019s get started',
    empty_welcome_title: 'Welcome to DispatchGO',
    empty_welcome_body: 'Begin your dispatcher journey — open the first chapter to start learning.',
    empty_cta_begin: 'Start first chapter',

    // How it works panel
    how_title: 'How it works',
    how_subtitle: 'Learn, quiz, and finish lessons step by step.',

    // Stats header
    stats_chapters: 'chapters',
    stats_max_level: 'max level',
    stats_streak: 'day streak',
    stats_your_level: 'your level',

    // Onboarding tour
    tour_skip: 'Skip',
    tour_back: 'Back',
    tour_next: 'Next',
    tour_get_started: 'Get started',
    tour_step_of: 'of',

    tour_step1_title: 'Read the lesson',
    tour_step1_body: 'Go through the lesson content — Intro, Theory, Demo, or Practice. Each lesson takes 5–15 minutes.',
    tour_step2_title: 'Pass the quiz',
    tour_step2_body: 'At the end of every lesson there is a quiz. Score at least 80% to complete the lesson.',
    tour_step3_title: 'Take the chapter test',
    tour_step3_body: 'Once all lessons are done, take the chapter test. Passing it unlocks the next chapter.',

    // How it works items
    how_item_lessons: 'Each chapter has 4 lessons: Intro → Theory → Demo → Practice.',
    how_item_quiz: 'Every lesson ends with a quiz — pass it (≥80%) to mark the lesson complete.',
    how_item_test: 'At the end of the chapter, take the final test.',
    how_item_unlock: 'Pass the test to unlock the next chapter.',

    // Lesson quiz gating
    lesson_quiz_status_reading: 'Reading the lesson',
    lesson_quiz_status_pending: 'Quiz pending',
    lesson_quiz_status_failed: 'Quiz failed — try again',
    lesson_quiz_status_passed: 'Quiz passed — you can complete the lesson',

    // Lesson meta (type + duration)
    lesson_meta_intro_label: 'Introduction',
    lesson_meta_intro_time: '5 min read',
    lesson_meta_theory_label: 'Theory',
    lesson_meta_theory_time: '10 min',
    lesson_meta_demo_label: 'Demo',
    lesson_meta_demo_time: '8 min',
    lesson_meta_practice_label: 'Practice',
    lesson_meta_practice_time: '15 min',
    lesson_meta_test_label: 'Chapter test',
    lesson_meta_test_time: '10 min',

    // Celebration

    // Empty state


    // Case renderer
    case_scenario: '📋 Scenario',
    case_what_would_you_do: 'What would you do?',

    // Dialogue
    dialogue_you: 'you',

    // Lesson content
    lesson_no_content: 'No content yet.',

    // Progress page
    progress_title: 'My Progress',
    progress_lessons: 'lessons',
    progress_test_passed: 'Test ✓',

    // Exams page (student)
    exams_title: 'My Exams',
    exams_empty: 'No exams yet. Pass a chapter test to request one.',
    exam_status_REQUESTED: 'Requested',
    exam_status_SCHEDULED: 'Scheduled',
    exam_status_COMPLETED: 'Completed',
    exam_status_CANCELLED: 'Cancelled',
    exam_decision_PASS: 'Pass',
    exam_decision_RETRY: 'Retry',
    exam_decision_DISBAND: 'Disband',

    // Manager exams
    manager_pending_title: 'Pending Exams',
    manager_pass: '✅ Pass',
    manager_retry: '🔄 Retry',
    manager_disband: '❌ Disband',
    manager_comment_placeholder: 'Comment (required, min 10 chars)',
    manager_submit: 'Submit',
    manager_cancel: 'Cancel',
    manager_no_pending: 'No pending exams 🎉',
    manager_review_exam: 'Review Exam',

    // Profile
    profile_title: 'Profile',
    profile_sign_out: 'Sign out',

    // Platform
    nav_platform: 'Platform',
    platform_title: 'Platform Training',
    platform_locked: 'Complete all 9 chapters to unlock',
    platform_progress: 'chapters completed',
    profile_language: 'Language',

    // Analytics
    analytics_title: 'Analytics',
    analytics_activity: 'Daily activity (last 30 days)',
    analytics_heatmap: 'When students study',
    analytics_funnel: 'Conversion funnel',
    analytics_chapter_difficulty: 'Chapter difficulty',
    analytics_question_stats: 'Question stats',
    analytics_hardest_questions: 'Hardest questions',
    stat_total_students: 'Total students',
    stat_active_students: 'Active (7d)',
    stat_completion_rate: 'Avg completion',
    stat_avg_score: 'Avg test score',
  },
  ru: {
    // Navigation
    nav_course: 'Курс',
    nav_progress: 'Прогресс',
    nav_exams: 'Экзамены',
    nav_profile: 'Профиль',
    nav_glossary: 'Словарь',

    // Auth
    auth_title: 'Обучение диспетчеров',
    auth_subtitle: 'Войдите в систему',
    auth_email: 'Email',
    auth_password: 'Пароль',
    auth_sign_in: 'Войти',
    auth_signing_in: 'Вход…',
    auth_login_failed: 'Ошибка входа',

    // Learn page
    learn_course_title: 'Курс по грузоперевозкам США',
    learn_hello: 'Привет',

    // Chapter card
    chapter_prefix: 'Гл.',
    chapter_exam_pending: 'Экзамен ожидает',
    chapter_complete: 'Завершено',

    // Lesson page
    lesson_mark_complete: 'Отметить как пройденное →',
    lesson_saving: 'Сохранение…',
    lesson_done: 'Готово! Переходим дальше…',
    lesson_back_to_chapter: 'Назад к главе',

    // Lesson types
    lesson_type_INTRO: 'Введение',
    lesson_type_THEORY: 'Теория',
    lesson_type_DEMO: 'Демо',
    lesson_type_PRACTICE: 'Практика',
    lesson_type_TEST: 'Тест',
    lesson_type_EXAM: 'Экзамен',

    // Quiz
    quiz_title: 'Проверка знаний',
    quiz_out_of: 'из',
    quiz_correct: 'правильно',
    quiz_goal_achieved: 'Цель достигнута ✓',
    quiz_proceed: 'Можно переходить к следующему уроку.',
    quiz_goal_not_achieved: 'Цель не достигнута',
    quiz_review_material: 'Повторите материал выше перед продолжением.',
    quiz_try_again: 'Попробовать снова',

    // Mandatory quiz flow
    lesson_status_reading: '📖 Чтение урока',
    lesson_status_quiz_pending: '❓ Ожидание теста',
    lesson_status_quiz_failed: '⚠️ Тест не пройден — попробуй ещё раз',
    lesson_status_quiz_passed: '✅ Тест пройден — заверши урок',
    lesson_complete_the_quiz: 'Пройди тест ниже чтобы завершить урок',
    lesson_quiz_required_tooltip: 'Пройди тест, чтобы продолжить',
    lesson_step_read: 'Читать материал',
    lesson_step_quiz: 'Пройти тест',
    lesson_step_complete: 'Завершить урок',
    quiz_success_banner: 'Отлично! Теперь можно завершить урок.',
    quiz_locked_hint: 'Урок нельзя завершить, пока не пройдён тест.',
    chapter_quizzes_passed: 'тестов пройдено',
    chapter_test_locked: 'Пройди все тесты уроков, чтобы открыть тест по главе',

    // Chapter unlock celebration
    celebrate_badge: 'Глава открыта',
    celebrate_title: 'Глава {n} открыта!',
    celebrate_body: 'Не останавливайся — начни следующую главу прямо сейчас.',
    celebrate_next_chapter: 'Начать следующую главу',
    celebrate_stay: 'Остаться здесь',

    // Empty state card
    empty_badge: 'Начнём',
    empty_welcome_title: 'Добро пожаловать в DispatchGO',
    empty_welcome_body: 'Начни путь диспетчера — открой первую главу и приступай к обучению.',
    empty_cta_begin: 'Начать первую главу',

    // How it works panel
    how_title: 'Как это работает',
    how_subtitle: 'Учись, проходи тесты и завершай уроки шаг за шагом.',

    // Stats header
    stats_chapters: 'глав',
    stats_max_level: 'макс. уровень',
    stats_streak: 'дней подряд',
    stats_your_level: 'твой уровень',

    // Onboarding tour
    tour_skip: 'Пропустить',
    tour_back: 'Назад',
    tour_next: 'Далее',
    tour_get_started: 'Начать',
    tour_step_of: 'из',

    tour_step1_title: 'Читай урок',
    tour_step1_body: 'Пройди содержание урока — Introduction, Theory, Demo или Practice. Каждый урок 5–15 минут.',
    tour_step2_title: 'Пройди квиз',
    tour_step2_body: 'В конце каждого урока есть квиз. Набери минимум 80% чтобы завершить урок.',
    tour_step3_title: 'Сдай тест главы',
    tour_step3_body: 'Когда все уроки пройдены, сдай финальный тест главы. Его успех открывает следующую главу.',

    // How it works items
    how_item_lessons: 'В каждой главе 4 урока: Intro → Theory → Demo → Practice.',
    how_item_quiz: 'Каждый урок заканчивается квизом — набери ≥80% чтобы завершить урок.',
    how_item_test: 'В конце главы сдай финальный тест.',
    how_item_unlock: 'Сдай тест чтобы открыть следующую главу.',

    // Lesson quiz gating
    lesson_quiz_status_reading: 'Читаем урок',
    lesson_quiz_status_pending: 'Квиз ждёт',
    lesson_quiz_status_failed: 'Квиз не сдан — попробуй ещё раз',
    lesson_quiz_status_passed: 'Квиз пройден — можно завершить урок',

    // Lesson meta (type + duration)
    lesson_meta_intro_label: 'Введение',
    lesson_meta_intro_time: '5 мин чтения',
    lesson_meta_theory_label: 'Теория',
    lesson_meta_theory_time: '10 мин',
    lesson_meta_demo_label: 'Демо',
    lesson_meta_demo_time: '8 мин',
    lesson_meta_practice_label: 'Практика',
    lesson_meta_practice_time: '15 мин',
    lesson_meta_test_label: 'Тест главы',
    lesson_meta_test_time: '10 мин',

    // Celebration

    // Empty state


    // Case renderer
    case_scenario: '📋 Ситуация',
    case_what_would_you_do: 'Что бы вы сделали?',

    // Dialogue
    dialogue_you: 'вы',

    // Lesson content
    lesson_no_content: 'Контент ещё не добавлен.',

    // Progress page
    progress_title: 'Мой прогресс',
    progress_lessons: 'уроков',
    progress_test_passed: 'Тест ✓',

    // Exams page (student)
    exams_title: 'Мои экзамены',
    exams_empty: 'Экзаменов пока нет. Пройдите тест по главе, чтобы запросить экзамен.',
    exam_status_REQUESTED: 'Запрошен',
    exam_status_SCHEDULED: 'Запланирован',
    exam_status_COMPLETED: 'Завершён',
    exam_status_CANCELLED: 'Отменён',
    exam_decision_PASS: 'Сдан',
    exam_decision_RETRY: 'Пересдача',
    exam_decision_DISBAND: 'Отчислен',

    // Manager exams
    manager_pending_title: 'Экзамены на проверке',
    manager_pass: '✅ Сдал',
    manager_retry: '🔄 Пересдача',
    manager_disband: '❌ Отчислить',
    manager_comment_placeholder: 'Комментарий (обязательно, мин. 10 символов)',
    manager_submit: 'Подтвердить',
    manager_cancel: 'Отмена',
    manager_no_pending: 'Нет ожидающих экзаменов 🎉',
    manager_review_exam: 'Проверить экзамен',

    // Profile
    profile_title: 'Профиль',
    profile_sign_out: 'Выйти',

    // Platform
    nav_platform: 'Платформа',
    platform_title: 'Обучение по платформе',
    platform_locked: 'Пройдите все 9 глав чтобы открыть',
    platform_progress: 'глав пройдено',
    profile_language: 'Язык',

    // Analytics
    analytics_title: 'Аналитика',
    analytics_activity: 'Активность (последние 30 дней)',
    analytics_heatmap: 'Когда студенты учатся',
    analytics_funnel: 'Воронка прохождения',
    analytics_chapter_difficulty: 'Сложность глав',
    analytics_question_stats: 'Статистика вопросов',
    analytics_hardest_questions: 'Самые сложные вопросы',
    stat_total_students: 'Всего студентов',
    stat_active_students: 'Активных (7д)',
    stat_completion_rate: 'Средний прогресс',
    stat_avg_score: 'Средний балл',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

// ── Chapter title translations (DB stores English, we translate on frontend) ──

export const chapterTitlesRu: Record<string, string> = {
  'Introduction to US Trucking':         'Введение в грузоперевозки США',
  'Geography & Time Zones':              'География и часовые пояса',
  'Equipment Types':                     'Типы оборудования',
  'Documentation (Rate Con, BOL, POD)':  'Документация (Rate Con, BOL, POD)',
  'Load Board Platform':                 'Платформа Load Board',
  'Communication with Brokers':          'Общение с брокерами',
  'Communication with Drivers':          'Общение с водителями',
  'Bidding & Deal Closing':              'Торги и закрытие сделок',
  'Recovery & Problem Solving':          'Решение проблем и нестандартных ситуаций',
};

// Lesson type label as stored in DB title prefix (seed generates e.g. "Intro — …")
export const lessonTypePrefixRu: Record<string, string> = {
  'Intro':     'Введение',
  'Theory':    'Теория',
  'Demo':      'Демо',
  'Practice':  'Практика',
  'Test':      'Тест',
  'Exam':      'Экзамен',
};

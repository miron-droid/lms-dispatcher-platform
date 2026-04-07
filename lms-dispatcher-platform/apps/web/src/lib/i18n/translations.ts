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

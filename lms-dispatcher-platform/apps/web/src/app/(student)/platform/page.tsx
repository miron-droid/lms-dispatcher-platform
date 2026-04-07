'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { useLang } from '@/lib/i18n/lang-context';
import { Lock, Play, ChevronDown, ChevronUp } from 'lucide-react';

const COURSE_ID = 'course-dispatchers-v1';

interface Video {
  titleEn: string;
  titleRu: string;
  src: string;
}

interface Category {
  emoji: string;
  nameEn: string;
  nameRu: string;
  videos: Video[];
}

const CATEGORIES: Category[] = [
  {
    emoji: '\u{1F680}',
    nameEn: 'Getting Started',
    nameRu: 'Начало работы',
    videos: [
      { titleEn: 'How to change unit\'s location and set IN SERVICE', titleRu: 'Как изменить локацию юнита и установить IN SERVICE', src: '/videos/change-unit-location.mp4' },
      { titleEn: 'How to authorize in Gmail and place a bid', titleRu: 'Как авторизоваться в Gmail и отправить бид', src: '/videos/authorize-gmail-bid.mp4' },
    ],
  },
  {
    emoji: '\u{1F50D}',
    nameEn: 'Working with Loads',
    nameRu: 'Работа с грузами',
    videos: [
      { titleEn: 'How to quick search fleet capacity', titleRu: 'Как быстро найти вместимость флота', src: '/videos/quick-search-fleet.mp4' },
      { titleEn: 'How to view loads for favorite trucks', titleRu: 'Как посмотреть грузы для избранных траков', src: '/videos/favorite-trucks.mp4' },
      { titleEn: 'How to remove loads with no trucks nearby', titleRu: 'Как убрать грузы без ближайших траков', src: '/videos/remove-no-trucks.mp4' },
      { titleEn: 'How to quick copy load information', titleRu: 'Как быстро скопировать информацию о грузе', src: '/videos/copy-load-info.mp4' },
    ],
  },
  {
    emoji: '\u{1F4B0}',
    nameEn: 'Bidding & Communication',
    nameRu: 'Биддинг и коммуникация',
    videos: [
      { titleEn: 'How to change bid email message', titleRu: 'Как изменить email сообщение бида', src: '/videos/change-bid-email.mp4' },
      { titleEn: 'How to cancel a driver bid', titleRu: 'Как отменить бид водителя', src: '/videos/cancel-driver-bid.mp4' },
      { titleEn: 'How to post a load for drivers (mobile app)', titleRu: 'Как разместить груз для водителей (мобильное приложение)', src: '/videos/post-load-mobile.mp4' },
    ],
  },
  {
    emoji: '\u{1F4CB}',
    nameEn: 'Order Management',
    nameRu: 'Управление заказами',
    videos: [
      { titleEn: 'How to create and track order', titleRu: 'Как создать и отследить заказ', src: '/videos/create-track-order.mp4' },
      { titleEn: 'How to change load status (checkout)', titleRu: 'Как изменить статус груза (checkout)', src: '/videos/change-load-status.mp4' },
      { titleEn: 'How to send email updates', titleRu: 'Как отправить обновления по email', src: '/videos/send-email-updates.mp4' },
    ],
  },
  {
    emoji: '\u{1F4B3}',
    nameEn: 'Accounting & Documents',
    nameRu: 'Учёт и документы',
    videos: [
      { titleEn: 'How to change payment type', titleRu: 'Как изменить тип оплаты', src: '/videos/change-payment-type.mp4' },
      { titleEn: 'Where to upload documents', titleRu: 'Где загрузить документы', src: '/videos/upload-documents.mp4' },
      { titleEn: 'How to cancel a load', titleRu: 'Как отменить груз', src: '/videos/cancel-load.mp4' },
    ],
  },
];

function VideoCard({ video, lang }: { video: Video; lang: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-[#2c2c2e] border border-gray-100 dark:border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Play className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="flex-1 text-sm font-medium text-gray-800 dark:text-[#f5f5f7]">
          {lang === 'ru' ? video.titleRu : video.titleEn}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 dark:text-[#636366] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-[#636366] flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <video
            controls
            className="w-full rounded-lg bg-black"
            src={video.src}
            preload="none"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default function PlatformPage() {
  const { t, lang } = useLang();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  useEffect(() => {
    if (!progress) coursesApi.initializeCourse(COURSE_ID).catch(() => {});
  }, [progress]);

  if (isLoading) return <PlatformSkeleton />;

  const completedCount = progress?.chapters?.filter((c: any) => c.status === 'COMPLETED').length ?? 0;
  const totalChapters = 9;
  const isUnlocked = completedCount >= totalChapters;
  const progressPct = Math.round((completedCount / totalChapters) * 100);

  if (!isUnlocked) {
    return (
      <div className="px-4 pt-14 lg:pt-6 pb-24 lg:pb-4 max-w-lg lg:max-w-2xl mx-auto">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-6 tracking-tight">
          {t('platform_title')}
        </h1>

        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-100 dark:border-[rgba(255,255,255,0.06)] p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center mx-auto mb-5">
            <Lock className="w-9 h-9 text-gray-400 dark:text-[#636366]" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#f5f5f7] mb-2">
            {t('platform_locked')}
          </h2>

          <p className="text-3xl font-bold text-emerald-600 mb-1">
            {completedCount}/{totalChapters}
          </p>
          <p className="text-sm text-gray-500 dark:text-[#a1a1a6] mb-5">
            {t('platform_progress')}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-[#2c2c2e] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-[#636366] mt-2">{progressPct}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-14 lg:pt-6 pb-24 lg:pb-4 max-w-lg lg:max-w-3xl mx-auto">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-5 tracking-tight">
        {t('platform_title')}
      </h1>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <section key={cat.nameEn}>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-[#a1a1a6] uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>{cat.emoji}</span>
              <span>{lang === 'ru' ? cat.nameRu : cat.nameEn}</span>
            </h2>
            <div className="space-y-2">
              {cat.videos.map((video) => (
                <VideoCard key={video.src} video={video} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function PlatformSkeleton() {
  return (
    <div className="px-4 pt-14 lg:pt-6 space-y-3 animate-pulse max-w-lg lg:max-w-3xl mx-auto">
      <div className="h-8 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl w-48" />
      <div className="h-4 bg-gray-100 dark:bg-[#2c2c2e] rounded w-32 mt-4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
      ))}
      <div className="h-4 bg-gray-100 dark:bg-[#2c2c2e] rounded w-32 mt-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
      ))}
    </div>
  );
}

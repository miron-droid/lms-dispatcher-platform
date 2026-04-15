'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, ChevronDown, Search, Users, Crown, Zap, Activity, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';
import { useAuthStore } from '@/lib/stores/auth.store';
import { apiFetch } from '@/lib/api/client';

/* ── helpers ── */
function timeAgo(date: string | null, lang: string): string {
  if (!date) return '\u2014';
  const ms = Date.now() - new Date(date).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return lang === 'ru' ? 'сейчас' : 'now';
  if (min < 60) return `${min}${lang === 'ru' ? ' мин' : 'm'}`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}${lang === 'ru' ? ' ч' : 'h'}`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}${lang === 'ru' ? ' дн' : 'd'}`;
  return new Date(date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' });
}

const ACTION_DOT: Record<string, string> = {
  LOGIN_SUCCESS: 'bg-blue-500',
  LOGIN_FAILED: 'bg-red-500',
  USER_CREATED: 'bg-emerald-500',
  USER_DEACTIVATED: 'bg-red-500',
  PASSWORD_RESET: 'bg-amber-500',
  PROGRESS_RESET: 'bg-orange-500',
};
const ACTION_LABEL: Record<string, { en: string; ru: string }> = {
  LOGIN_SUCCESS: { en: 'Login', ru: 'Вход' },
  LOGIN_FAILED: { en: 'Login failed', ru: 'Неудачный вход' },
  USER_CREATED: { en: 'Created user', ru: 'Создал' },
  USER_DEACTIVATED: { en: 'Deactivated', ru: 'Деактивировал' },
  PASSWORD_RESET: { en: 'Password reset', ru: 'Сброс пароля' },
  PROGRESS_RESET: { en: 'Progress reset', ru: 'Сброс прогресса' },
};

const ROLE_BADGE: Record<string, string> = {
  ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-600/15 dark:text-blue-400',
  MANAGER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  STUDENT: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-[#a1a1a6]',
};

const FEED_CATEGORIES: Record<string, string> = {
  LOGIN_SUCCESS: 'logins', LOGIN_FAILED: 'logins',
  USER_CREATED: 'user_mgmt', USER_DEACTIVATED: 'user_mgmt',
  PASSWORD_RESET: 'user_mgmt', PROGRESS_RESET: 'progress',
};

/* ── types ── */
interface UserRow {
  id: string; email: string; firstName: string; lastName: string; role: string;
  createdAt: string; lastActiveAt: string | null; totalXP: number; streak: number;
  managerId: string | null; chaptersCompleted: number; studentsCount?: number;
}
interface AuditEvent {
  id: string; action: string; actorId: string; actorEmail: string;
  targetId: string | null; targetEmail: string | null; ipAddress: string | null;
  createdAt: string;
}
interface ControlData {
  stats: { totalUsers: number; activeLast7d: number; avgStudentXP: number; eventsToday: number };
  users: UserRow[]; recentEvents: AuditEvent[];
}
interface UserActivity { logs: AuditEvent[]; total: number; page: number; totalPages: number }

export default function ControlPage() {
  const { lang } = useLang();
  const user = useAuthStore((s) => s.user);
  const t = (en: string, ru: string) => (lang === 'ru' ? ru : en);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedCategory, setFeedCategory] = useState('all');
  const [feedDate, setFeedDate] = useState('7d');

  if (user?.email !== 'miron@etlgroupll.com') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="w-16 h-16 text-gray-300 dark:text-[#636366]" />
        <p className="text-lg text-gray-500 dark:text-[#636366] font-medium">{t('Access Denied', 'Доступ запрещён')}</p>
      </div>
    );
  }

  const { data, isLoading } = useQuery<ControlData>({
    queryKey: ['control-data'],
    queryFn: () => apiFetch('/admin/owner/control-data'),
    refetchInterval: 30000,
  });

  const { data: userActivity } = useQuery<UserActivity>({
    queryKey: ['user-activity', expandedId],
    queryFn: () => apiFetch(`/admin/owner/user-activity/${expandedId}`),
    enabled: !!expandedId,
  });

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    let list = data.users;
    if (roleFilter !== 'ALL') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [data?.users, roleFilter, search]);

  const filteredEvents = useMemo(() => {
    if (!data?.recentEvents) return [];
    let events = data.recentEvents;
    if (feedCategory !== 'all') events = events.filter((e) => FEED_CATEGORIES[e.action] === feedCategory);
    if (feedDate !== 'all') {
      const now = Date.now();
      const cutoff = feedDate === 'today' ? new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        : feedDate === '7d' ? now - 7 * 86400000 : now - 30 * 86400000;
      events = events.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
    }
    return events;
  }, [data?.recentEvents, feedCategory, feedDate]);

  const stats = data?.stats;

  const rolePills = [
    { key: 'ALL', label: t('All', 'Все') },
    { key: 'ADMIN', label: 'Admin' },
    { key: 'MANAGER', label: 'Manager' },
    { key: 'STUDENT', label: t('Student', 'Студент') },
  ];
  const feedCategoryPills = [
    { key: 'all', label: t('All', 'Все') },
    { key: 'logins', label: t('Logins', 'Входы') },
    { key: 'user_mgmt', label: t('User Mgmt', 'Пользователи') },
    { key: 'progress', label: t('Progress', 'Прогресс') },
  ];
  const feedDatePills = [
    { key: 'today', label: t('Today', 'Сегодня') },
    { key: '7d', label: '7d' },
    { key: '30d', label: '30d' },
    { key: 'all', label: t('All', 'Все') },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Crown className="w-6 h-6 text-amber-500" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">{t('Command Center', 'Центр управления')}</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t('Total Users', 'Всего'), value: stats?.totalUsers ?? 0, dot: 'bg-blue-500' },
          { label: t('Active 7d', 'Актив 7д'), value: stats?.activeLast7d ?? 0, dot: 'bg-emerald-500' },
          { label: t('Avg XP', 'Ср. XP'), value: stats?.avgStudentXP ?? 0, dot: 'bg-amber-500' },
          { label: t('Events Today', 'Событий'), value: stats?.eventsToday ?? 0, dot: 'bg-purple-500' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-2 h-2 rounded-full', s.dot)} />
              <span className="text-[13px] text-gray-500 dark:text-[#a1a1a6]">{s.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-[#f5f5f7]">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="sticky top-12 lg:top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl py-3 -mx-4 px-4 space-y-3 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#636366]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search users...', 'Поиск пользователей...')}
            className="w-full bg-gray-100 dark:bg-[#1c1c1e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#636366] outline-none border border-gray-200 dark:border-white/[0.04] focus:border-blue-500 dark:focus:border-blue-600/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {rolePills.map((p) => (
            <button
              key={p.key}
              onClick={() => setRoleFilter(p.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
                roleFilter === p.key
                  ? 'bg-gray-900 text-white dark:bg-[#f5f5f7] dark:text-black'
                  : 'bg-gray-100 text-gray-600 dark:bg-[#2c2c2e] dark:text-[#a1a1a6] hover:bg-gray-200 dark:hover:text-white',
              )}
            >
              {p.label}
            </button>
          ))}
          <span className="text-[13px] text-gray-400 dark:text-[#636366] self-center ml-auto">
            {filteredUsers.length} {t('users', 'польз.')}
          </span>
        </div>
      </div>

      {/* User cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredUsers.map((u) => {
          const isExpanded = expandedId === u.id;
          const initials = `${u.firstName?.charAt(0) ?? ''}${u.lastName?.charAt(0) ?? ''}`.toUpperCase();
          const progress = u.chaptersCompleted / 9;

          return (
            <div key={u.id} className="card overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : u.id)}
                className="w-full p-4 flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-[#a1a1a6] flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900 dark:text-[#f5f5f7] truncate">
                      {u.firstName} {u.lastName}
                    </span>
                    <span className={cn('text-[11px] px-2 py-0.5 rounded-full font-semibold', ROLE_BADGE[u.role] ?? ROLE_BADGE.STUDENT)}>
                      {u.role}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 dark:text-[#636366] truncate">{u.email}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-400 dark:text-[#636366] flex-wrap">
                    {u.role === 'STUDENT' ? (
                      <>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{(u.totalXP ?? 0).toLocaleString()} XP</span>
                        <span className="text-gray-300 dark:text-[#3a3a3c]">&middot;</span>
                        <span className="text-orange-500">🔥 {u.streak ?? 0}d</span>
                        <span className="text-gray-300 dark:text-[#3a3a3c]">&middot;</span>
                        <span>{u.chaptersCompleted}/9 {t('ch', 'гл')}</span>
                        <span className="text-gray-300 dark:text-[#3a3a3c]">&middot;</span>
                        <span>{timeAgo(u.lastActiveAt, lang)}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{u.studentsCount ?? 0} {t('students', 'студ.')}</span>
                        <span className="text-gray-300 dark:text-[#3a3a3c]">&middot;</span>
                        <span>{timeAgo(u.lastActiveAt, lang)}</span>
                      </>
                    )}
                  </div>
                  {u.role === 'STUDENT' && (
                    <div className="mt-2 h-1.5 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
                    </div>
                  )}
                </div>
                <ChevronDown className={cn('w-4 h-4 text-gray-400 dark:text-[#636366] flex-shrink-0 transition-transform duration-200', isExpanded && 'rotate-180')} />
              </button>

              {/* Expanded */}
              <div className={cn('overflow-hidden transition-all duration-300', isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0')}>
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-white/[0.04] pt-3">
                  {u.role === 'STUDENT' && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-[#636366] mb-1.5">{t('Chapter Progress', 'Прогресс по главам')}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 9 }, (_, i) => (
                          <div key={i} className={cn('h-2.5 flex-1 rounded-full', i < u.chaptersCompleted ? 'bg-blue-500' : 'bg-gray-100 dark:bg-[#2c2c2e]')} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400 dark:text-[#636366]">Ch 1</span>
                        <span className="text-[10px] text-gray-400 dark:text-[#636366]">Ch 9</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-xl p-3">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-[#f5f5f7]">{(u.totalXP ?? 0).toLocaleString()}</p>
                        <p className="text-[11px] text-gray-400 dark:text-[#636366]">XP</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-[#f5f5f7]">{u.streak ?? 0}</p>
                        <p className="text-[11px] text-gray-400 dark:text-[#636366]">{t('Day Streak', 'Дней подряд')}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/[0.06] grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-[#a1a1a6]">
                      <div>{t('Created', 'Создан')}: {new Date(u.createdAt).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' })}</div>
                      <div>{t('Last seen', 'Послед.')}: {timeAgo(u.lastActiveAt, lang)}</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-[#636366] mb-2">{t('Recent Activity', 'Последняя активность')}</p>
                    {userActivity && expandedId === u.id ? (
                      userActivity.logs.length > 0 ? (
                        <div className="space-y-1.5">
                          {userActivity.logs.slice(0, 8).map((ev) => (
                            <div key={ev.id} className="flex items-center gap-2 text-[12px]">
                              <span className="text-gray-400 dark:text-[#636366] w-12 flex-shrink-0 tabular-nums text-[11px]">
                                {new Date(ev.createdAt).toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', ACTION_DOT[ev.action] ?? 'bg-gray-400')} />
                              <span className="font-medium text-gray-700 dark:text-[#a1a1a6]">
                                {ACTION_LABEL[ev.action]?.[lang === 'ru' ? 'ru' : 'en'] ?? ev.action}
                              </span>
                              {ev.targetEmail && (
                                <span className="text-gray-400 dark:text-[#636366] truncate">→ {ev.targetEmail}</span>
                              )}
                              {ev.ipAddress && (
                                <span className="text-gray-300 dark:text-[#4a4a4e] ml-auto flex-shrink-0 hidden sm:block text-[10px] font-mono">{ev.ipAddress}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] text-gray-400 dark:text-[#636366]">{t('No activity', 'Нет активности')}</p>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-gray-300 dark:border-[#636366] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[12px] text-gray-400 dark:text-[#636366]">{t('Loading...', 'Загрузка...')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-[#636366] opacity-50" />
          <p className="text-sm text-gray-500 dark:text-[#636366]">{t('No users found', 'Пользователи не найдены')}</p>
        </div>
      )}

      {/* Activity Feed */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#f5f5f7]">{t('Activity', 'Активность')}</h2>
          <span className="text-[12px] bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 px-2 py-0.5 rounded-full font-semibold">
            {stats?.eventsToday ?? 0} {t('today', 'сегодня')}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {feedCategoryPills.map((p) => (
            <button key={p.key} onClick={() => setFeedCategory(p.key)}
              className={cn('px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
                feedCategory === p.key ? 'bg-gray-900 text-white dark:bg-[#f5f5f7] dark:text-black' : 'bg-gray-100 text-gray-600 dark:bg-[#2c2c2e] dark:text-[#a1a1a6] hover:bg-gray-200 dark:hover:text-white')}>
              {p.label}
            </button>
          ))}
          <div className="w-px h-6 bg-gray-200 dark:bg-white/[0.06] self-center mx-1" />
          {feedDatePills.map((p) => (
            <button key={p.key} onClick={() => setFeedDate(p.key)}
              className={cn('px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
                feedDate === p.key ? 'bg-gray-900 text-white dark:bg-[#f5f5f7] dark:text-black' : 'bg-gray-100 text-gray-600 dark:bg-[#2c2c2e] dark:text-[#a1a1a6] hover:bg-gray-200 dark:hover:text-white')}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="space-y-0.5">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <span className="text-[12px] text-gray-400 dark:text-[#636366] w-12 flex-shrink-0 tabular-nums">
                {new Date(ev.createdAt).toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', ACTION_DOT[ev.action] ?? 'bg-gray-400')} />
              <span className="text-[13px] font-medium text-gray-800 dark:text-[#a1a1a6] flex-shrink-0">
                {ACTION_LABEL[ev.action]?.[lang === 'ru' ? 'ru' : 'en'] ?? ev.action}
              </span>
              <span className="text-[12px] text-gray-500 dark:text-[#636366] truncate">
                {ev.actorEmail}{ev.targetEmail ? ` → ${ev.targetEmail}` : ''}
              </span>
              {ev.ipAddress && (
                <span className="text-[10px] text-gray-300 dark:text-[#4a4a4e] ml-auto flex-shrink-0 hidden sm:block font-mono">{ev.ipAddress}</span>
              )}
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <p className="text-center text-[13px] text-gray-400 dark:text-[#636366] py-8">{t('No events', 'Нет событий')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

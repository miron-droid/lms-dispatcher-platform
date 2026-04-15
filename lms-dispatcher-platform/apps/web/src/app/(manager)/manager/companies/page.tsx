'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, Shield, Users, Check, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';
import { useAuthStore } from '@/lib/stores/auth.store';
import { apiFetch } from '@/lib/api/client';

interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  maxStudents: number;
  createdAt: string;
  _count?: { users: number };
}

export default function CompaniesPage() {
  const { lang } = useLang();
  const t = (en: string, ru: string) => (lang === 'ru' ? ru : en);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formMaxStudents, setFormMaxStudents] = useState(100);
  const [formError, setFormError] = useState('');

  // Access only for SUPER_ADMIN
  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="w-16 h-16 text-gray-300 dark:text-[#636366]" />
        <p className="text-lg text-gray-500 dark:text-[#636366] font-medium">
          {t('Access Denied', 'Доступ запрещён')}
        </p>
        <p className="text-sm text-gray-400 dark:text-[#636366]">
          {t('Only platform owner can manage companies', 'Только владелец платформы может управлять компаниями')}
        </p>
      </div>
    );
  }

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => apiFetch('/companies'),
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; maxStudents: number }) =>
      apiFetch('/companies', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
      resetForm();
      setShowCreate(false);
    },
    onError: (err: any) => setFormError(err.message ?? 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; maxStudents?: number; isActive?: boolean }) =>
      apiFetch(`/companies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
      setEditing(null);
      resetForm();
    },
    onError: (err: any) => setFormError(err.message ?? 'Failed to update'),
  });

  function resetForm() {
    setFormName('');
    setFormSlug('');
    setFormMaxStudents(100);
    setFormError('');
  }

  function startEdit(company: Company) {
    setEditing(company);
    setFormName(company.name);
    setFormSlug(company.slug);
    setFormMaxStudents(company.maxStudents);
    setShowCreate(false);
    setFormError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!formName.trim()) { setFormError(t('Name required', 'Имя обязательно')); return; }
    if (editing) {
      updateMutation.mutate({ id: editing.id, name: formName.trim(), maxStudents: formMaxStudents });
    } else {
      if (!formSlug.trim()) { setFormError(t('Slug required', 'Slug обязателен')); return; }
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(formSlug)) { setFormError(t('Slug: lowercase letters, numbers, dashes only', 'Slug: только строчные буквы, цифры, дефисы')); return; }
      createMutation.mutate({ name: formName.trim(), slug: formSlug.trim(), maxStudents: formMaxStudents });
    }
  }

  function toggleActive(company: Company) {
    updateMutation.mutate({ id: company.id, isActive: !company.isActive });
  }

  // Auto-generate slug from name
  function onNameChange(val: string) {
    setFormName(val);
    if (!editing && !formSlug) {
      const auto = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormSlug(auto);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-14 lg:pt-6 pb-24 lg:pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
              {t('Companies', 'Компании')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#636366]">
              {companies.length} {t('total', 'всего')}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowCreate(!showCreate); setEditing(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('Add Company', 'Добавить компанию')}
        </button>
      </div>

      {/* Create/Edit form */}
      {(showCreate || editing) && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-[#f5f5f7]">
              {editing ? t('Edit Company', 'Редактировать компанию') : t('New Company', 'Новая компания')}
            </h2>
            <button
              onClick={() => { setShowCreate(false); setEditing(null); resetForm(); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3a3c]"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-[#636366]" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a6] mb-1">
                {t('Company Name', 'Название')}
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="ETL Group"
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a6] mb-1">
                {t('Slug (for internal use)', 'Slug (для системы)')}
              </label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                placeholder="etl-group"
                className="input w-full font-mono text-sm"
                disabled={!!editing}
                required
              />
              <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">
                {t('Lowercase letters, numbers, dashes. Cannot be changed later.', 'Строчные буквы, цифры, дефисы. Изменить потом нельзя.')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a6] mb-1">
                {t('Max Students', 'Макс. студентов')}
              </label>
              <input
                type="number"
                value={formMaxStudents}
                onChange={(e) => setFormMaxStudents(parseInt(e.target.value) || 100)}
                min={1}
                max={10000}
                className="input w-full"
              />
            </div>
            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {createMutation.isPending || updateMutation.isPending
                ? t('Saving...', 'Сохраняем...')
                : editing ? t('Save Changes', 'Сохранить') : t('Create Company', 'Создать')}
            </button>
          </form>
        </div>
      )}

      {/* Companies list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 card">
          <Building2 className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-[#636366]" />
          <p className="text-sm text-gray-500 dark:text-[#636366]">
            {t('No companies yet. Click "Add Company" to create one.', 'Компаний пока нет. Нажми "Добавить компанию".')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {companies.map((c) => (
            <div key={c.id} className={cn('card p-4 transition-opacity', !c.isActive && 'opacity-60')}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-[#f5f5f7] truncate">{c.name}</h3>
                      {!c.isActive && (
                        <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                          {t('INACTIVE', 'НЕАКТИВНА')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-gray-500 dark:text-[#636366] truncate">{c.slug}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-[#a1a1a6]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {c._count?.users ?? 0} / {c.maxStudents}
                      </span>
                      <span className="text-gray-300 dark:text-[#3a3a3c]">·</span>
                      <span>{new Date(c.createdAt).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(c)}
                    title={c.isActive ? t('Deactivate', 'Деактивировать') : t('Activate', 'Активировать')}
                    className={cn(
                      'p-2 rounded-lg transition-colors cursor-pointer',
                      c.isActive
                        ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3a3c]',
                    )}
                  >
                    {c.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(c)}
                    title={t('Edit', 'Редактировать')}
                    className="p-2 rounded-lg text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-100 dark:hover:bg-[#3a3a3c] transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

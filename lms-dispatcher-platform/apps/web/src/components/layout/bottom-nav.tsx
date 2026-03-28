'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChartBar, GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/learn',    label: 'Course',   icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: ChartBar },
  { href: '/exams',    label: 'Exams',    icon: GraduationCap },
  { href: '/profile',  label: 'Profile',  icon: User },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                active ? 'text-brand-600' : 'text-gray-400',
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

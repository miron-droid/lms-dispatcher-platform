'use client';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function ProfilePage() {
  const user      = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router    = useRouter();

  function logout() {
    clearAuth();
    router.replace('/login');
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold mb-6">Profile</h1>
      <div className="card flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center">
          <User className="w-7 h-7 text-brand-600" />
        </div>
        <div>
          <p className="font-bold">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            {user?.role}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        className="card w-full flex items-center gap-3 text-red-500 active:bg-red-50"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign out</span>
      </button>
    </div>
  );
}

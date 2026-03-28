import { Providers } from '@/components/providers';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen pb-20">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </Providers>
  );
}

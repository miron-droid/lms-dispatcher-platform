import { Providers } from '@/components/providers';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </Providers>
  );
}

'use client';

import { ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

interface BotDetailsLayoutProps {
  children: ReactNode;
}

function BotDetailsLayoutContent({ children }: BotDetailsLayoutProps) {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <DashboardLayout>
      <div className="w-full">{children}</div>
    </DashboardLayout>
  );
}

export default function BotDetailsLayout({ children }: BotDetailsLayoutProps) {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </DashboardLayout>
      }
    >
      <BotDetailsLayoutContent>{children}</BotDetailsLayoutContent>
    </Suspense>
  );
}


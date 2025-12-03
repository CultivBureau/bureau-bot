'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { ConfigureContent } from '../../../components/bot-details/configure/ConfigureContent';
import { Loader2 } from 'lucide-react';

function ConfigurePageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Bot Configuration"
      description="Manage assistant credentials, wait times, and instructions."
    >
      <ConfigureContent />
    </BotDetailsPageShell>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell
          botId={null}
          title="Bot Configuration"
          loading={true}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </BotDetailsPageShell>
      }
    >
      <ConfigurePageContent />
    </Suspense>
  );
}


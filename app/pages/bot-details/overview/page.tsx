'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/BotDetailsPageShell';
import { OverviewContent } from '../../../components/bot-details/OverviewContent';
import { Loader2 } from 'lucide-react';

function OverviewPageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Overview"
      description={
        botId
          ? 'Track responses, sessions, tokens and spend for this bot.'
          : 'Select a bot to view its overview.'
      }
    >
      <OverviewContent />
    </BotDetailsPageShell>
  );
}

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell
          botId={null}
          title="Overview"
          loading={true}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </BotDetailsPageShell>
      }
    >
      <OverviewPageContent />
    </Suspense>
  );
}


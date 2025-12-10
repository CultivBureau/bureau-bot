'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { OverviewContent } from '../../../components/bot-details/overview/OverviewContent';

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
          <div />
        </BotDetailsPageShell>
      }
    >
      <OverviewPageContent />
    </Suspense>
  );
}


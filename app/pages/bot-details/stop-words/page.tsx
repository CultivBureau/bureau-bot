'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { StopWordsContent } from '../../../components/bot-details/stop-words/StopWordsContent';

function StopWordsPageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Stop Words"
      description="Manage stop words for your bot to ignore during processing."
    >
      <StopWordsContent />
    </BotDetailsPageShell>
  );
}

export default function StopWordsPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Stop Words" loading={true}>
          <div />
        </BotDetailsPageShell>
      }
    >
      <StopWordsPageContent />
    </Suspense>
  );
}

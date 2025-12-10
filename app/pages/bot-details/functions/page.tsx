'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { FunctionsContent } from '../../../components/bot-details/functions/FunctionsContent';

function FunctionsPageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Functions"
      description="Manage custom functions and tools for your bot."
    >
      <FunctionsContent />
    </BotDetailsPageShell>
  );
}

export default function FunctionsPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Functions" loading={true}>
          <div />
        </BotDetailsPageShell>
      }
    >
      <FunctionsPageContent />
    </Suspense>
  );
}


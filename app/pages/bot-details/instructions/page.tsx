'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { InstructionsContent } from '../../../components/bot-details/instructions/InstructionsContent';

function InstructionsPageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Instructions"
      description="Edit the system instructions that guide your bot's behavior."
    >
      <InstructionsContent />
    </BotDetailsPageShell>
  );
}

export default function InstructionsPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Instructions" loading={true}>
          <div />
        </BotDetailsPageShell>
      }
    >
      <InstructionsPageContent />
    </Suspense>
  );
}


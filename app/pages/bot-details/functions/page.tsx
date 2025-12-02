'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/BotDetailsPageShell';
import { FunctionsContent } from '../../../components/bot-details/FunctionsContent';
import { Loader2 } from 'lucide-react';

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
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </BotDetailsPageShell>
      }
    >
      <FunctionsPageContent />
    </Suspense>
  );
}


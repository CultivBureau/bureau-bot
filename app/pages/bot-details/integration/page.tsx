'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/BotDetailsPageShell';
import { IntegrationsContent } from '../../../components/bot-details/IntegrationsContent';
import { Loader2 } from 'lucide-react';

function IntegrationPageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Integrations"
      description="Connect external services and APIs to extend your bot's capabilities."
    >
      <IntegrationsContent />
    </BotDetailsPageShell>
  );
}

export default function IntegrationPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Integrations" loading={true}>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </BotDetailsPageShell>
      }
    >
      <IntegrationPageContent />
    </Suspense>
  );
}


'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { IntegrationsContent } from '../../../components/bot-details/integration/IntegrationsContent';

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
          <div />
        </BotDetailsPageShell>
      }
    >
      <IntegrationPageContent />
    </Suspense>
  );
}


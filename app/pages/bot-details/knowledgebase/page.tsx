'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { KnowledgebaseContent } from '../../../components/bot-details/knowledgebase/KnowledgebaseContent';

function KnowledgebasePageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Knowledge Base"
      description="Manage documents and information that your bot can reference."
    >
      <KnowledgebaseContent />
    </BotDetailsPageShell>
  );
}

export default function KnowledgebasePage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Knowledge Base" loading={true}>
          <div />
        </BotDetailsPageShell>
      }
    >
      <KnowledgebasePageContent />
    </Suspense>
  );
}


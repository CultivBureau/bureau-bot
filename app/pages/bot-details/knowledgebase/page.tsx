'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/BotDetailsPageShell';
import { KnowledgebaseContent } from '../../../components/bot-details/KnowledgebaseContent';
import { Loader2 } from 'lucide-react';

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
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </BotDetailsPageShell>
      }
    >
      <KnowledgebasePageContent />
    </Suspense>
  );
}


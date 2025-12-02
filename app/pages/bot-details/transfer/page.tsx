'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/BotDetailsPageShell';
import { TransferContent } from '../../../components/bot-details/TransferContent';
import { Loader2 } from 'lucide-react';

function TransferPageContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  return (
    <BotDetailsPageShell
      botId={botId}
      title="Transfer Bot"
      description="Transfer ownership of this bot to another user."
    >
      <TransferContent />
    </BotDetailsPageShell>
  );
}

export default function TransferPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Transfer Bot" loading={true}>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </BotDetailsPageShell>
      }
    >
      <TransferPageContent />
    </Suspense>
  );
}


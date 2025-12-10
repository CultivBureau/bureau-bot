'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BotDetailsPageShell } from '../../../components/bot-details/shared/BotDetailsPageShell';
import { TransferContent } from '../../../components/bot-details/transfer/TransferContent';

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
          <div />
        </BotDetailsPageShell>
      }
    >
      <TransferPageContent />
    </Suspense>
  );
}


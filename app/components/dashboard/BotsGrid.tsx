'use client';

import { memo } from 'react';
import { BotCard } from './BotCard';
import { EmptyState } from './EmptyState';
import type { BotData, Bot } from '../../types/bot';

interface BotsGridProps {
  bots: BotData[];
  onEdit: (botId: string) => Promise<void>;
  onToggleActive: (botId: string) => Promise<void>;
  onCreateBot: () => void;
}

export const BotsGrid = memo(function BotsGrid({
  bots,
  onEdit,
  onToggleActive,
  onCreateBot,
}: BotsGridProps) {
  if (bots.length === 0) {
    return <EmptyState onCreateBot={onCreateBot} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bots.map((bot) => (
        <BotCard
          key={bot.id}
          bot={bot}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
});


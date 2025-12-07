'use client';

import { memo } from 'react';
import { Plus } from 'lucide-react';

interface BotsPageHeaderProps {
  onCreateBot: () => void;
}

export const BotsPageHeader = memo(function BotsPageHeader({
  onCreateBot,
}: BotsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-hero-text">Bots</h1>
        <p className="mt-1 text-sm text-hero-subtext">Manage all your AI chatbots</p>
      </div>
      <button
        onClick={onCreateBot}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Create Bot
      </button>
    </div>
  );
});


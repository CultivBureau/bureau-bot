'use client';

import { MessageCircle, Sparkles, Activity, Coins } from 'lucide-react';

interface SummaryCard {
  title: string;
  value: string | number;
  helper?: string;
  icon: React.ReactNode;
  accent: string;
}

interface OverviewSummaryCardsProps {
  totalRequests?: number;
  totalTokens?: number;
  activeSessions?: number;
  totalSpend?: number;
  currency?: string;
  latestResponses?: string;
  latestCompletions?: string;
}

export function OverviewSummaryCards({
  totalRequests = 0,
  totalTokens = 0,
  activeSessions = 0,
  totalSpend = 0,
  currency = 'USD',
  latestResponses = '+0%',
  latestCompletions = '+0%',
}: OverviewSummaryCardsProps) {
  const cards: SummaryCard[] = [
    {
      title: 'Total requests',
      value: totalRequests.toLocaleString(),
      helper: `Last change ${latestResponses}`,
      icon: <MessageCircle className="h-5 w-5" />,
      accent: 'bg-primary/15 text-primary',
    },
    {
      title: 'Total tokens',
      value: totalTokens.toLocaleString(),
      helper: 'Combined input & output',
      icon: <Sparkles className="h-5 w-5" />,
      accent: 'bg-primary/15 text-primary',
    },
    {
      title: 'Active sessions',
      value: activeSessions.toLocaleString(),
      helper: `Last change ${latestCompletions}`,
      icon: <Activity className="h-5 w-5" />,
      accent: 'bg-green-500/15 text-green-600 dark:text-green-400',
    },
    {
      title: 'Total spend',
      value: totalSpend.toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
      }),
      helper: `Lifetime spend in ${currency}`,
      icon: <Coins className="h-5 w-5" />,
      accent: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-5 shadow-sm transition hover:shadow-md"
        >
          <div
            className={`mb-4 inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${card.accent}`}
          >
            {card.icon}
            <span className="ml-2">{card.title}</span>
          </div>
          <div className="text-3xl font-semibold text-card-foreground">
            {card.value}
          </div>
          {card.helper && (
            <p className="mt-2 text-sm text-muted-foreground">{card.helper}</p>
          )}
        </div>
      ))}
    </div>
  );
}


'use client';

import { Bot, Play, Pause, Users } from "lucide-react";
import { BotData } from "./BotCard";

interface SummaryMetric {
  title: string;
  value: string | number;
  helper?: string;
  accent: string;
  icon: React.ReactNode;
}

interface SummaryCardsProps {
  bots: BotData[];
}

export function SummaryCards({ bots }: SummaryCardsProps) {
  const totalBots = bots.length;
  const activeBots = bots.filter((bot) => bot.is_active).length;
  const inactiveBots = totalBots - activeBots;
  const mostUsedBot = bots.reduce<BotData | null>((acc, bot) => {
    const usage = bot.usage_count ?? 0;
    if (!acc) return bot;
    const accUsage = acc.usage_count ?? 0;
    return usage > accUsage ? bot : acc;
  }, null);

  const summaryCards: SummaryMetric[] = [
    {
      title: 'Total bots',
      value: totalBots,
      helper: 'Across all channels',
      accent: 'bg-primary/15 text-primary',
      icon: <Bot className="h-5 w-5" />
    },
    {
      title: 'Working bots',
      value: activeBots,
      helper: 'Currently responding',
      accent: 'bg-green-500/15 text-green-600 dark:text-green-400',
      icon: <Play className="h-5 w-5" />
    },
    {
      title: 'Not working bots',
      value: inactiveBots,
      helper: 'Disabled or paused',
      accent: 'bg-red-500/15 text-red-600 dark:text-red-400',
      icon: <Pause className="h-5 w-5" />
    },
    {
      title: 'Most used bot',
      value: mostUsedBot?.name ?? '—',
      helper:
        mostUsedBot && (mostUsedBot.usage_count ?? 0) > 0
          ? `${mostUsedBot.usage_count} conversations`
          : 'No usage yet',
      accent: 'bg-primary/15 text-primary',
      icon: <Users className="h-5 w-5" />
    }
  ];

  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((metric) => (
        <div
          key={metric.title}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-5 shadow-sm transition hover:shadow-md"
        >
          <div
            className={`mb-4 inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${metric.accent}`}
          >
            {metric.icon}
            <span className="ml-2">{metric.title}</span>
          </div>
          <div className="text-3xl font-semibold text-card-foreground">
            {metric.value}
          </div>
          {metric.helper && (
            <p className="mt-2 text-sm text-muted-foreground">
              {metric.helper}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}


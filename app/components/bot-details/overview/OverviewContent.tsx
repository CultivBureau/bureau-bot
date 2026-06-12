'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { botService } from '../../../services/bot';
import { reportsService } from '../../../services/reports';
import type { Bot } from '../../../types/bot';
import { OverviewSummaryCards } from './OverviewSummaryCards';
import { OverviewCharts } from './OverviewCharts';

interface ChartDataPoint {
  label: string;
  responses: number;
  completions: number;
  spend: number;
}

interface AnalyticsPayload {
  total_requests?: number;
  requests?: number;
  message_count?: number;
  total_tokens?: number;
  token_count?: number;
  active_sessions?: number;
  sessions_active?: number;
  session_count?: number;
  total_spend?: number;
  spend?: number;
  revenue?: number;
  currency?: string;
  timeseries?: ChartDataPoint[];
  responses_series?: ChartDataPoint[];
  completions_series?: ChartDataPoint[];
  spend_series?: ChartDataPoint[];
  daily?: ChartDataPoint[];
}

const safeNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const normalizeAnalytics = (payload: any): {
  summary: {
    totalRequests: number;
    totalTokens: number;
    activeSessions: number;
    totalSpend: number;
    currency: string;
  };
  series: ChartDataPoint[];
} => {
  const summarySource: AnalyticsPayload = payload ?? {};

  const totalRequests =
    safeNumber(summarySource.total_requests) ||
    safeNumber(summarySource.requests) ||
    safeNumber(summarySource.message_count);

  const totalTokens =
    safeNumber(summarySource.total_tokens) ||
    safeNumber(summarySource.token_count);

  const activeSessions =
    safeNumber(summarySource.active_sessions) ||
    safeNumber(summarySource.sessions_active) ||
    safeNumber(summarySource.session_count);

  const totalSpend =
    safeNumber(summarySource.total_spend) ||
    safeNumber(summarySource.spend) ||
    safeNumber(summarySource.revenue);

  const currency =
    typeof summarySource.currency === 'string' && summarySource.currency.length
      ? summarySource.currency.toUpperCase()
      : 'USD';

  const candidates =
    summarySource.responses_series ||
    summarySource.timeseries ||
    summarySource.daily ||
    [];

  const series = Array.isArray(candidates)
    ? candidates.map((item: any, index: number): ChartDataPoint => ({
        label:
          typeof item.label === 'string'
            ? item.label
            : item.date ||
              item.day ||
              `#${index + 1}`,
        responses:
          safeNumber(item.responses) ||
          safeNumber(item.response_count) ||
          safeNumber(item.messages) ||
          0,
        completions:
          safeNumber(item.completions) ||
          safeNumber(item.chat_completions) ||
          safeNumber(item.ai_messages) ||
          0,
        spend:
          safeNumber(item.spend) ||
          safeNumber(item.cost) ||
          safeNumber(item.revenue) ||
          0,
      }))
    : [];

  return {
    summary: {
      totalRequests,
      totalTokens,
      activeSessions,
      totalSpend,
      currency,
    },
    series,
  };
};

const percentageChange = (current: number, previous: number) => {
  if (!previous) return '+0%';
  const diff = ((current - previous) / previous) * 100;
  const rounded = diff.toFixed(1);
  return `${diff >= 0 ? '+' : ''}${rounded}%`;
};

export function OverviewContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<ChartDataPoint[]>([]);
  const [summary, setSummary] = useState({
    totalRequests: 0,
    totalTokens: 0,
    activeSessions: 0,
    totalSpend: 0,
    currency: 'USD',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!botId) {
        setError('Select a bot from the bots list to view its overview.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [botResponse, analyticsResponse] = await Promise.allSettled([
          botService.getBotById(botId),
          reportsService.getAnalytics({ bot_id: botId, range: '30d' }),
        ]);

        if (botResponse.status === 'fulfilled') {
          setBot(botResponse.value);
        } else {
          throw botResponse.reason;
        }

        if (analyticsResponse.status === 'fulfilled') {
          const payload = analyticsResponse.value;
          const normalized = normalizeAnalytics(payload);
          setSummary(normalized.summary);
          setSeries(normalized.series);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unable to load bot analytics.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [botId]);

  const latestResponses = useMemo(() => {
    if (series.length < 2) return '+0%';
    const last = series[series.length - 1]?.responses ?? 0;
    const prev = series[series.length - 2]?.responses ?? 0;
    return percentageChange(last, prev);
  }, [series]);

  const latestCompletions = useMemo(() => {
    if (series.length < 2) return '+0%';
    const last = series[series.length - 1]?.completions ?? 0;
    const prev = series[series.length - 2]?.completions ?? 0;
    return percentageChange(last, prev);
  }, [series]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-muted-foreground">Loading overview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center text-muted-foreground">
        Bot data not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewSummaryCards
        totalRequests={summary.totalRequests}
        totalTokens={summary.totalTokens}
        activeSessions={summary.activeSessions}
        totalSpend={summary.totalSpend}
        currency={summary.currency}
        latestResponses={latestResponses}
        latestCompletions={latestCompletions}
      />

      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Runtime metadata</h2>
          <p className="text-sm text-muted-foreground">
            Provider-aware details for the active bot session.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 text-sm">
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-muted-foreground">Provider</div>
            <div className="mt-1 font-medium text-card-foreground">{bot.llm_provider || 'openai'}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-muted-foreground">Model</div>
            <div className="mt-1 font-medium text-card-foreground">{bot.llm_model || bot.gpt_model}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-muted-foreground">Provider resource ID</div>
            <div className="mt-1 font-medium text-card-foreground break-all">
              {bot.provider_resource_id || bot.assistant_id || 'Not set'}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-muted-foreground">Provider key fingerprint</div>
            <div className="mt-1 font-medium text-card-foreground break-all">
              {bot.provider_key_fingerprint || 'Not available'}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-muted-foreground">Provider conversation ID</div>
            <div className="mt-1 font-medium text-card-foreground break-all">
              {bot.provider_conversation_id || 'Not available'}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-muted-foreground">Thread binding</div>
            <div className="mt-1 font-medium text-card-foreground break-all">
              {bot.thread_binding_reason || 'Not available'}
            </div>
          </div>
        </div>
        {bot.thread_binding_reason === 'mistral_direct_chat' && (
          <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            This bot is using direct-chat conversation semantics, not OpenAI thread semantics.
          </p>
        )}
        {bot.provider_runtime_metadata && (
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-background/70 p-4 text-xs text-muted-foreground">
            {typeof bot.provider_runtime_metadata === 'string'
              ? bot.provider_runtime_metadata
              : JSON.stringify(bot.provider_runtime_metadata, null, 2)}
          </pre>
        )}
      </div>

      <OverviewCharts series={series} currency={summary.currency} />
    </div>
  );
}


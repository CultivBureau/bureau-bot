'use client';

interface ChartDataPoint {
  label: string;
  responses: number;
  completions: number;
  spend: number;
}

interface OverviewChartsProps {
  series: ChartDataPoint[];
  currency?: string;
}

export function OverviewCharts({
  series = [],
  currency = 'USD',
}: OverviewChartsProps) {
  if (series.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            Responses vs chat completions
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Trend of assistant replies and generated completions
          </p>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No response data yet.
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            Total spend
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Lifetime spend across completions
          </p>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No spend data yet.
          </div>
        </div>
      </div>
    );
  }

  const maxResponses = Math.max(
    ...series.map((point) => Math.max(point.responses, point.completions))
  );
  const maxSpend = Math.max(...series.map((point) => point.spend));

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Responses vs Completions Chart */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            Responses vs chat completions
          </h2>
          <p className="text-sm text-muted-foreground">
            Trend of assistant replies and generated completions
          </p>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {series.map((point, index) => {
            const responseHeight = maxResponses > 0 
              ? (point.responses / maxResponses) * 100 
              : 0;
            const completionHeight = maxResponses > 0 
              ? (point.completions / maxResponses) * 100 
              : 0;

            return (
              <div key={index} className="flex-1 flex items-end gap-1">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                  style={{ height: `${responseHeight}%` }}
                  title={`Responses: ${point.responses}`}
                />
                <div
                  className="w-full bg-gradient-to-t from-violet-500 to-indigo-500 rounded-t"
                  style={{ height: `${completionHeight}%` }}
                  title={`Completions: ${point.completions}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            Responses
          </div>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-300">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-indigo-500" />
            Chat completions
          </div>
        </div>
      </div>

      {/* Spend Chart */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            Total spend
          </h2>
          <p className="text-sm text-muted-foreground">
            Lifetime spend across completions
          </p>
        </div>
        <div className="text-3xl font-semibold text-card-foreground mb-6">
          {series.reduce((sum, point) => sum + point.spend, 0).toLocaleString(undefined, {
            style: 'currency',
            currency: currency,
          })}
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {series.map((point, index) => {
            const spendHeight = maxSpend > 0 
              ? (point.spend / maxSpend) * 100 
              : 0;

            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-orange-500/80 to-orange-500/20 rounded-t"
                style={{ height: `${spendHeight}%` }}
                title={`${point.label}: ${point.spend.toLocaleString(undefined, {
                  style: 'currency',
                  currency: currency,
                })}`}
              />
            );
          })}
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          Total spend shown in {currency}.
        </div>
      </div>
    </div>
  );
}


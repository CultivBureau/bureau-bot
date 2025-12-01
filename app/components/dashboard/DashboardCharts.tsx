'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { BotData } from '../../types/bot';

interface DashboardChartsProps {
  bots: BotData[];
}

// Dashboard chart color palette - cyan/teal shades
const CHART_COLORS = {
  primary: '#06B6D4',      // Primary - bright cyan/teal
  lighten1: '#39C8E0',     // Lighten 1 - softer, lighter version
  lighten2: '#6EDBF0',     // Lighten 2 - very light teal
  lighten3: '#A2EEFA',     // Lighten 3 - almost pastel
  darken1: '#0592AB',      // Darken 1 - deeper teal
  darken2: '#047187',      // Darken 2 - stronger contrast
  darken3: '#034E5E',      // Darken 3 - very dark teal
};

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.lighten1,
  CHART_COLORS.lighten2,
  CHART_COLORS.darken1,
  CHART_COLORS.darken2,
];

export function DashboardCharts({ bots }: DashboardChartsProps) {
  // Prepare data for histogram (usage by bot)
  const usageData = bots
    .map((bot) => ({
      name: bot.name.length > 15 ? bot.name.substring(0, 15) + '...' : bot.name,
      usage: bot.usage_count || 0,
      sessions: bot.total_sessions || 0,
    }))
    .sort((a, b) => b.usage - a.usage);

  // Prepare data for pie chart (bots by channel type)
  const channelData = bots.reduce((acc, bot) => {
    const channel = bot.channel_type || 'unknown';
    const existing = acc.find((item) => item.name === channel);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: channel, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Histogram Chart */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Bot Usage Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="usage" fill={CHART_COLORS.primary} name="Total Usage" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sessions" fill={CHART_COLORS.lighten1} name="Sessions" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Bots by Channel Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill={CHART_COLORS.primary}
              dataKey="value"
            >
              {channelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


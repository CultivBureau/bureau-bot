'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BotData } from './BotCard';

interface DashboardChartsProps {
  bots: BotData[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

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
            <Bar dataKey="usage" fill="hsl(var(--chart-1))" name="Total Usage" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sessions" fill="hsl(var(--chart-2))" name="Sessions" radius={[8, 8, 0, 0]} />
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
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
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


'use client';

import { useState, useEffect, useCallback } from 'react';
import { BotData } from '../../components/dashboard/BotCard';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { DashboardCharts } from '../../components/dashboard/DashboardCharts';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { LoadingState } from '../../components/dashboard/LoadingState';

// Mock API - Replace with your actual API calls
const mockBotsAPI = {
  getBots: async (): Promise<{ data: BotData[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - Replace with actual API call
    return {
      data: [
        {
          id: '1',
          name: 'Customer Support Bot',
          channel_type: 'whatsapp',
          gpt_model: 'gpt-4',
          is_active: true,
          created_on: '2024-01-15',
          updated_on: '2024-01-20',
          usage_count: 1250,
          total_sessions: 45,
        },
        {
          id: '2',
          name: 'Sales Assistant',
          channel_type: 'telegram',
          gpt_model: 'gpt-3.5-turbo',
          is_active: true,
          created_on: '2024-01-10',
          updated_on: '2024-01-18',
          usage_count: 890,
          total_sessions: 32,
        },
        {
          id: '3',
          name: 'Help Desk Bot',
          channel_type: 'web',
          gpt_model: 'gpt-4',
          is_active: false,
          created_on: '2024-01-05',
          updated_on: '2024-01-12',
          usage_count: 450,
        },
      ],
    };
  },
};

export default function DashboardPage() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mockBotsAPI.getBots();
      const botsList = Array.isArray(response.data)
        ? response.data
        : response.data || [];
      setBots(botsList);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Something went wrong while fetching bots.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-hero-text">Dashboard</h1>
          <p className="mt-1 text-sm text-hero-subtext">Overview of your bots and analytics</p>
        </div>

        {/* Summary Cards */}
        <SummaryCards bots={bots} />

        {/* Charts */}
        {bots.length > 0 && <DashboardCharts bots={bots} />}

        {/* Error Display */}
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


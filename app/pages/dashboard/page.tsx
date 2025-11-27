'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BotCard, BotData } from '../../components/dashboard/BotCard';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { EmptyState } from '../../components/dashboard/EmptyState';
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
  toggleActive: async (botId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Toggle active for bot:', botId);
  },
  deleteBot: async (botId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Delete bot:', botId);
  },
};

export default function DashboardPage() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [botToDelete, setBotToDelete] = useState<BotData | null>(null);

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

  const handleToggleActive = useCallback(
    async (botId: string) => {
      try {
        await mockBotsAPI.toggleActive(botId);
        setBots((prev) =>
          prev.map((bot) =>
            bot.id === botId ? { ...bot, is_active: !bot.is_active } : bot
          )
        );
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
          (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
          (err as { message?: string })?.message ||
          'Failed to toggle bot status';
        setError(errorMessage);
      }
    },
    []
  );

  const handleDeleteBot = useCallback((botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (bot) {
      setBotToDelete(bot);
      setShowDeleteConfirm(true);
    }
  }, [bots]);

  const confirmDeleteBot = useCallback(async () => {
    if (!botToDelete) return;
    try {
      await mockBotsAPI.deleteBot(botToDelete.id);
      setBots((prev) => prev.filter((b) => b.id !== botToDelete.id));
      setShowDeleteConfirm(false);
      setBotToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Failed to delete bot';
      setError(errorMessage);
    }
  }, [botToDelete]);

  const handleCreateNewBot = useCallback(() => {
    // TODO: Open create bot modal or navigate to create page
    console.log('Create new bot');
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end text-foreground">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 z-10">
        {/* Back Button */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-hero-circle/30 backdrop-blur-lg bg-hero-circle/10 text-hero-text transition hover:bg-hero-circle/20"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Summary Cards */}
        <SummaryCards bots={bots} />

        {/* Header */}
        <DashboardHeader onCreateBot={handleCreateNewBot} />

        {/* Error Display */}
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Bots Grid */}
        <section>
          {bots.length === 0 ? (
            <EmptyState onCreateBot={handleCreateNewBot} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bots.map((bot) => (
                <BotCard
                  key={bot.id}
                  bot={bot}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDeleteBot}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && botToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3 text-destructive">
              <h3 className="text-lg font-semibold">Delete bot</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This will permanently remove <span className="font-semibold">{botToDelete.name}</span>{' '}
              and any associated OpenAI assistant. This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBotToDelete(null);
                }}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBot}
                className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


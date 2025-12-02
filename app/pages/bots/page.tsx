'use client';

import { useState, useEffect, useCallback } from 'react';
import { BotCard } from '../../components/dashboard/BotCard';
import type { BotData, Bot, ChannelType } from '../../types/bot';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { LoadingState } from '../../components/dashboard/LoadingState';
import { NewBotModal } from '../../components/dashboard/NewBotModal';
import { botService } from '../../services/bot';
import { store } from '../../store/store';
import { Plus } from 'lucide-react';

// Helper function to map Bot from API to BotData for UI
const mapBotToBotData = (bot: Bot): BotData => {
  return {
    id: bot.id,
    name: bot.name,
    channel_type: bot.channel_type,
    gpt_model: bot.gpt_model,
    is_active: bot.is_active,
    created_on: bot.created_on,
    updated_on: bot.updated_on,
    assistant_name: bot.assistant_name,
    working: bot.working,
    // Note: usage_count and total_sessions are not in the API response
    // They would need to come from a separate endpoint if needed
  };
};

export default function BotsPage() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [fullBots, setFullBots] = useState<Bot[]>([]); // Store full bot objects for editing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [botToEdit, setBotToEdit] = useState<Bot | null>(null);
  const [channelTypes, setChannelTypes] = useState<ChannelType[]>([]);

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await botService.getBots({
        pageNumber: 1,
        pageSize: 20, // Get up to 20 bots per page
        status: 'all',
      });
      
      // Store full bot objects for editing
      setFullBots(response.results);
      // Map Bot objects to BotData for UI
      const botsList = response.results.map(mapBotToBotData);
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

  // Fetch channel types for label mapping
  useEffect(() => {
    const fetchChannelTypes = async () => {
      // Check if token exists before making the request
      const state = store.getState();
      const token = state.auth.token;
      
      if (!token) {
        console.warn('No authentication token available. Skipping channel types fetch.');
        return;
      }
      
      try {
        const types = await botService.getChannelTypes();
        setChannelTypes(types);
      } catch (err) {
        console.error('Failed to fetch channel types:', err);
      }
    };
    fetchChannelTypes();
  }, []);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleEditBot = useCallback(async (botId: string) => {
    try {
      // Fetch the latest bot data to ensure we have all current information
      const bot = await botService.getBotById(botId);
      setBotToEdit(bot);
      setShowNewBotModal(true);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Failed to load bot data';
      setError(errorMessage);
      console.error('Error fetching bot:', err);
    }
  }, []);

  const handleToggleActive = useCallback(async (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;
    
    try {
      if (bot.is_active) {
        // Deactivate the bot
        await botService.deleteBot(botId);
      } else {
        // Activate the bot
        await botService.restoreBot(botId);
      }
      // Refresh the bots list after toggle
      await fetchBots();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        `Failed to ${bot.is_active ? 'deactivate' : 'activate'} bot`;
      setError(errorMessage);
    }
  }, [bots, fetchBots]);

  const handleCreateNewBot = useCallback(() => {
    setBotToEdit(null);
    setShowNewBotModal(true);
  }, []);


  const handleSubmitNewBot = useCallback(async () => {
    try {
      // The bot creation/update is handled by the modal, just refresh the list
      await fetchBots();
      setShowNewBotModal(false);
      setBotToEdit(null);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Failed to refresh bots list';
      setError(errorMessage);
    }
  }, [fetchBots]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hero-text">Bots</h1>
            <p className="mt-1 text-sm text-hero-subtext">Manage all your AI chatbots</p>
          </div>
          <button
            onClick={handleCreateNewBot}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Bot
          </button>
        </div>

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
                  channelTypes={channelTypes}
                  onEdit={handleEditBot}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* New/Edit Bot Modal */}
      <NewBotModal
        isOpen={showNewBotModal}
        onClose={() => {
          setShowNewBotModal(false);
          setBotToEdit(null);
        }}
        onSubmit={handleSubmitNewBot}
        bot={botToEdit || undefined}
      />

    </DashboardLayout>
  );
}


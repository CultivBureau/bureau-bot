'use client';

import { useState, useEffect, useCallback } from 'react';
import { BotCard } from '../../components/dashboard/BotCard';
import type { BotData, Bot, ChannelType } from '../../types/bot';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { LoadingState } from '../../components/dashboard/LoadingState';
import { NewBotModal } from '../../components/dashboard/NewBotModal';
import { botService } from '../../services/bot';
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [botToDelete, setBotToDelete] = useState<BotData | null>(null);
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
      await botService.deleteBot(botToDelete.id);
      // Refresh the bots list after deletion
      await fetchBots();
      setShowDeleteConfirm(false);
      setBotToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Failed to delete bot';
      setError(errorMessage);
      setShowDeleteConfirm(false);
      setBotToDelete(null);
    }
  }, [botToDelete, fetchBots]);

  const handleCreateNewBot = useCallback(() => {
    setBotToEdit(null);
    setShowNewBotModal(true);
  }, []);

  const handleRestoreBot = useCallback(async (botId: string) => {
    try {
      await botService.restoreBot(botId);
      // Refresh the bots list after restore
      await fetchBots();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Failed to restore bot';
      setError(errorMessage);
    }
  }, [fetchBots]);

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
                  onDelete={handleDeleteBot}
                  onRestore={handleRestoreBot}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && botToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3 text-destructive">
              <h3 className="text-lg font-semibold">Delete bot</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This will deactivate <span className="font-semibold">{botToDelete.name}</span>{' '}
              (soft delete - sets working=False and is_active=False). The bot can be restored later.
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
    </DashboardLayout>
  );
}


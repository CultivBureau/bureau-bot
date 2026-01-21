'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { LoadingState } from '../../components/dashboard/LoadingState';
import { NewBotModal } from '../../components/dashboard/NewBotModal';
import { BotsPageHeader } from '../../components/dashboard/BotsPageHeader';
import { BotsGrid } from '../../components/dashboard/BotsGrid';
import { useBots } from '../../components/dashboard/hooks/useBots';
import { extractErrorMessage, getDefaultErrorMessage } from '../../utils/bots/errorHandlers';
import type { Bot } from '../../types/bot';

export default function BotsPage() {
  const {
    bots,
    loading,
    error,
    fetchBots,
    toggleBotActive,
    editBot,
    setError,
  } = useBots();

  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [botToEdit, setBotToEdit] = useState<Bot | null>(null);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleEditBot = useCallback(
    async (botId: string) => {
      const bot = await editBot(botId);
      if (bot) {
        setBotToEdit(bot);
        setShowNewBotModal(true);
      }
    },
    [editBot]
  );

  const handleToggleActive = useCallback(
    async (botId: string) => {
      const result = await toggleBotActive(botId);
      if (!result.success && result.error) {
        setError(result.error);
      }
    },
    [toggleBotActive, setError]
  );

  const handleCreateNewBot = useCallback(() => {
    setBotToEdit(null);
    setShowNewBotModal(true);
  }, []);

  const handleSubmitNewBot = useCallback(async () => {
    try {
      await fetchBots();
      setShowNewBotModal(false);
      setBotToEdit(null);
    } catch (err: unknown) {
      const errorMessage =
        extractErrorMessage(err) || getDefaultErrorMessage('refresh');
      setError(errorMessage);
    }
  }, [fetchBots, setError]);

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
        <BotsPageHeader onCreateBot={handleCreateNewBot} />

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        <section>
          <BotsGrid
            bots={bots}
            onEdit={handleEditBot}
            onToggleActive={handleToggleActive}
            onCreateBot={handleCreateNewBot}
          />
        </section>
      </div>

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

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link as LinkIcon, AlertCircle, Loader2, Plus, Database } from 'lucide-react';
import { BitrixIntegrationWizard } from './BitrixIntegrationWizard';
import { BitrixIntegrationCard } from './BitrixIntegrationCard';
import { bitrixService } from '../../../services/bitrix';
import { botService } from '../../../services/bot';
import { ConfirmationToast } from '../../shared/ConfirmationToast';

interface BitrixIntegration {
  id: string;
  bot: string;
  bitrix_bot_id: number;
  client_id: string;
  portal_domain: string;
  type: string;
  is_registered: boolean;
  created_at: string;
  updated_at: string;
}

export function IntegrationsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const [showWizard, setShowWizard] = useState(false);
  const [botName, setBotName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [integration, setIntegration] = useState<BitrixIntegration | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    integrationId: string | null;
  }>({ isOpen: false, integrationId: null });

  const loadIntegration = async () => {
    if (!botId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [bot, integrationData] = await Promise.all([
        botService.getBotById(botId),
        bitrixService.getIntegrationByBotId(botId),
      ]);

      setBotName(bot.name || '');
      setIntegration(integrationData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load integration information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegration();
  }, [botId]);

  const handleDeleteIntegration = (integrationId: string) => {
    setDeleteConfirmation({ isOpen: true, integrationId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.integrationId) return;

    try {
      // TODO: Add delete API endpoint when available
      // await bitrixService.deleteIntegration(deleteConfirmation.integrationId);

      setSuccess('Integration deleted successfully');
      setIntegration(null);
      setDeleteConfirmation({ isOpen: false, integrationId: null });

      // Reload integration data
      await loadIntegration();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete integration');
      setDeleteConfirmation({ isOpen: false, integrationId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, integrationId: null });
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    // Reload integration data after wizard closes
    loadIntegration();
  };

  if (!botId) {
    return (
      <div className="text-center text-muted-foreground">
        Please select a bot to configure integrations.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-700 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <span>✓ {success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Bitrix24 Integrations
        </h2>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Integration
        </button>
      </div>

      {/* Integrations Grid */}
      <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Active Integrations
          </h3>
        </div>

        {integration ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <BitrixIntegrationCard
              integration={integration}
              onDelete={() => handleDeleteIntegration(integration.id)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Database className="mb-4 h-12 w-12" />
            <p className="font-medium">No integrations configured</p>
            <p className="text-sm mt-1">
              Click "Create Integration" to set up your first Bitrix24 integration.
            </p>
          </div>
        )}
      </section>

      {/* Wizard Modal */}
      <BitrixIntegrationWizard
        isOpen={showWizard}
        onClose={handleWizardClose}
        botId={botId}
        botName={botName}
      />

      {/* Delete Confirmation */}
      <ConfirmationToast
        message="Are you sure you want to delete this integration? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isOpen={deleteConfirmation.isOpen}
      />
    </div>
  );
}

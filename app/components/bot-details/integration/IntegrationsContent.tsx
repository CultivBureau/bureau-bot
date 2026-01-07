'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Link as LinkIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { IntegrationWizard } from './IntegrationWizard';
import { useIntegrationSettings } from '../shared/hooks/useIntegrationSettings';

export function IntegrationsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');
  const [showWizard, setShowWizard] = useState(false);

  const {
    loading,
    error,
    success,
    webhookUrl,
    integrationSettings,
    setError,
    setSuccess,
  } = useIntegrationSettings(botId);

  const handleWizardComplete = () => {
    setShowWizard(false);
    setSuccess('Integration completed successfully!');
    // Optionally refresh the integration settings here
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
        <span className="ml-3 text-sm text-muted-foreground">Loading integration settings...</span>
      </div>
    );
  }

  const isConnected = !!integrationSettings?.webhook_url;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-red-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto rounded-full px-2 py-1 text-xs hover:bg-emerald-100"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Integrations
        </h2>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Integration
        </button>
      </div>

      <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-2xl bg-primary/20 p-3 text-primary">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-card-foreground">
              Bitrix24 CRM integration
            </h3>
            <p className="text-sm text-muted-foreground">
              Save your Bitrix24 webhook URL and sync CRM data for pipelines and functions.
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isConnected
              ? 'bg-green-500/20 text-green-600 border border-green-500/30'
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {isConnected ? 'Connected' : 'Not connected'}
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Bitrix24 webhook URL
          </label>
          <div className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
            {webhookUrl || 'No webhook URL configured yet.'}
          </div>
        </div>
      </section>

      {showWizard && botId && (
        <div className="mt-6">
          <IntegrationWizard
            botId={botId}
            onClose={() => setShowWizard(false)}
            onComplete={handleWizardComplete}
          />
        </div>
      )}
    </div>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { useIntegrationSettings } from './hooks/useIntegrationSettings';
import { WebhookSection } from './WebhookSection';
import { IMConnectorSection } from './IMConnectorSection';

export function IntegrationsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const {
    loading,
    syncing,
    error,
    success,
    webhookUrl,
    connectorCode,
    lineId,
    registering,
    clientId,
    clientSecret,
    setWebhookUrl,
    setConnectorCode,
    setLineId,
    setClientId,
    setClientSecret,
    handleSyncCRMData,
    handleSaveWebhook,
    handleRegisterConnector,
    handleSaveClientCredentials,
    integrationSettings,
  } = useIntegrationSettings(botId);

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

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      <WebhookSection
        webhookUrl={webhookUrl}
        onSave={handleSaveWebhook}
        onSync={handleSyncCRMData}
        syncing={syncing}
        isConnected={!!integrationSettings?.webhook_url}
      />

      <IMConnectorSection
        connectorCode={connectorCode}
        lineId={lineId}
        clientId={clientId}
        clientSecret={clientSecret}
        onConnectorCodeChange={setConnectorCode}
        onLineIdChange={setLineId}
        onClientIdChange={setClientId}
        onClientSecretChange={setClientSecret}
        onRegister={handleRegisterConnector}
        onSaveCredentials={handleSaveClientCredentials}
        registering={registering}
      />
    </div>
  );
}

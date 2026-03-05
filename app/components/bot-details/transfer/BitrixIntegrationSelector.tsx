'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { bitrixService } from '../../../services/bitrix';

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

interface BitrixIntegrationSelectorProps {
  botId: string | null;
  selectedIntegrationId: string | null;
  onSelect: (integrationId: string | null) => void;
  disabled?: boolean;
}

export function BitrixIntegrationSelector({
  botId,
  selectedIntegrationId,
  onSelect,
  disabled = false,
}: BitrixIntegrationSelectorProps) {
  const [integrations, setIntegrations] = useState<BitrixIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!botId) {
        setIntegrations([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        // Get integration by bot ID - this returns the integration for this bot
        const integration = await bitrixService.getIntegrationByBotId(botId);
        if (integration) {
          setIntegrations([integration]);
          // Auto-select if no selection made yet
          if (!selectedIntegrationId) {
            onSelect(integration.id);
          }
        } else {
          setIntegrations([]);
          setError('No Bitrix integration found for this bot. Please create one in the Integrations tab.');
        }
      } catch (err) {
        setError('Failed to load integrations');
        setIntegrations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  const selectedIntegration = useMemo(() => {
    return integrations.find(i => i.id === selectedIntegrationId) || null;
  }, [integrations, selectedIntegrationId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Bitrix Integration <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading integrations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Bitrix Integration <span className="text-destructive">*</span>
        </label>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          {error}
        </div>
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-card-foreground">
          Bitrix Integration <span className="text-destructive">*</span>
        </label>
        <div className="rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
          No integrations available. Please create one in the Integrations tab.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Bitrix Integration <span className="text-destructive">*</span>
      </label>
      <select
        value={selectedIntegrationId || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        disabled={disabled || integrations.length === 0}
        required
        className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
      >
        <option value="">Select an integration...</option>
        {integrations.map((integration) => (
          <option key={integration.id} value={integration.id}>
            {integration.portal_domain} {integration.is_registered ? '(Active)' : '(Inactive)'}
          </option>
        ))}
      </select>
      {selectedIntegration && (
        <div className="text-xs text-muted-foreground mt-1">
          Portal: {selectedIntegration.portal_domain} • Type: {selectedIntegration.type}
        </div>
      )}
    </div>
  );
}

